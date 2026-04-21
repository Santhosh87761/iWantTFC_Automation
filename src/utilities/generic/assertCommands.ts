import allure from '@wdio/allure-reporter'

type ElementLike = WebdriverIO.Element | ReturnType<typeof $>

interface CommandMeta {
    command: string
    locator?: string
    displayLocator?: string
    expected?: string
    screenshotAfter?: boolean
    element?: ElementLike
}

export default class AssertionHelper {

    private static readonly DEFAULT_TIMEOUT = 10000

    private static normalizeLabel(value: unknown): string | undefined {
        if (typeof value !== 'string') {
            return undefined
        }

        const normalized = value.replace(/\s+/g, ' ').trim()
        if (!normalized) {
            return undefined
        }

        const lowered = normalized.toLowerCase()
        if (lowered === 'null' || lowered === 'undefined' || lowered === 'none' || lowered === 'n/a') {
            return undefined
        }

        return normalized.length > 80 ? `${normalized.slice(0, 77)}...` : normalized
    }

    private static extractLabelFromLocator(locator?: string): string | undefined {
        const v = AssertionHelper.normalizeLabel(locator)
        if (!v) return undefined

        if (v.startsWith('~')) {
            return AssertionHelper.normalizeLabel(v.slice(1))
        }

        const exactTextMatch =
            v.match(/@(?:text|content-desc|aria-label|alt|title|placeholder|name|label|resource-id)\s*=\s*["']([^"']+)["']/i) ||
            v.match(/\[(?:text|content-desc|aria-label|alt|title|placeholder|name|label|resource-id)\s*=\s*["']([^"']+)["']/i) ||
            v.match(/text\(\)\s*=\s*["']([^"']+)["']/i)
        if (exactTextMatch?.[1]) return AssertionHelper.normalizeLabel(exactTextMatch[1])

        const containsTextMatch =
            v.match(/contains\(\s*@(?:text|content-desc|aria-label|alt|title|placeholder|name|label|resource-id)\s*,\s*["']([^"']+)["']\s*\)/i) ||
            v.match(/contains\(\s*text\(\)\s*,\s*["']([^"']+)["']\s*\)/i) ||
            v.match(/contains\(\s*\.\s*,\s*["']([^"']+)["']\s*\)/i)
        if (containsTextMatch?.[1]) return AssertionHelper.normalizeLabel(containsTextMatch[1])

        const cssAttrMatch =
            v.match(/\[(?:aria-label|alt|title|placeholder|name|label|data-testid|resource-id)\s*\*?=\s*["']([^"']+)["'][^\]]*\]/i)
        if (cssAttrMatch?.[1]) return AssertionHelper.normalizeLabel(cssAttrMatch[1])

        const uiAutomatorMatch =
            v.match(/\b(?:text|textContains|textMatches|description|descriptionContains|descriptionMatches)\(\"([^\"]+)\"\)/i)
        if (uiAutomatorMatch?.[1]) return AssertionHelper.normalizeLabel(uiAutomatorMatch[1])

        return undefined
    }

    private static async resolveElementLabel(element: ElementLike, locator?: string): Promise<string | undefined> {
        const el = await (element as WebdriverIO.Element)
        try {
            const text = AssertionHelper.normalizeLabel(await el.getText())
            if (text) return text
        } catch {
            // ignore
        }

        const attrCandidates = [
            'aria-label',
            'alt',
            'title',
            'placeholder',
            'name',
            'value',
            'id',
            'data-testid',
            'content-desc',
            'label',
            'resource-id'
        ] as const

        for (const attr of attrCandidates) {
            try {
                const v = AssertionHelper.normalizeLabel(await el.getAttribute(attr))
                if (v) return v
            } catch {
                // ignore
            }
        }

        if (locator) {
            const m =
                locator.match(/@(?:text|content-desc|name|aria-label|alt|title|id)\s*=\s*["']([^"']+)["']/i) ||
                locator.match(/\[(?:text|content-desc|name|aria-label|alt|title|id)\s*=\s*["']([^"']+)["']/i)
            if (m?.[1]) {
                return AssertionHelper.normalizeLabel(m[1])
            }
        }

        return undefined
    }

    private static shortenLocator(locator?: string): string | undefined {
        const v = AssertionHelper.normalizeLabel(locator)
        if (!v) return undefined

        const extracted = AssertionHelper.extractLabelFromLocator(v)
        if (extracted) return extracted

        const idMatch = v.match(/@id\s*=\s*["']([^"']+)["']/i) || v.match(/#([A-Za-z0-9_-]+)/)
        if (idMatch?.[1]) return `#${idMatch[1]}`

        const textMatch =
            v.match(/@(?:text|content-desc|aria-label|alt|title)\s*=\s*["']([^"']+)["']/i) ||
            v.match(/\[(?:text|content-desc|aria-label|alt|title)\s*=\s*["']([^"']+)["']/i)
        if (textMatch?.[1]) return AssertionHelper.normalizeLabel(textMatch[1])

        const classMatch = v.match(/@class\s*=\s*["']([^"']+)["']/i) || v.match(/\.([A-Za-z0-9_-]+)/)
        if (classMatch?.[1]) return `.${classMatch[1].split(/\s+/)[0]}`

        return v
    }

    // =========================================================
    // CORE ASSERT STEP ENGINE
    // =========================================================
    private static async assertStep<T>(
        meta: CommandMeta,
        action: () => Promise<T>
    ): Promise<T> {

        try {
            const resolvedDisplay =
                meta.displayLocator ||
                (meta.element ? await AssertionHelper.resolveElementLabel(meta.element, meta.locator) : undefined) ||
                AssertionHelper.shortenLocator(meta.locator) ||
                meta.locator ||
                ''

            allure.addStep(resolvedDisplay ? `${meta.command} - ${resolvedDisplay}` : meta.command)

            const result = await action()

            if (meta.screenshotAfter) {
                const screenshot = await browser.takeScreenshot()
                allure.addAttachment(
                    `${meta.command} Screenshot`,
                    Buffer.from(screenshot, 'base64'),
                    'image/png'
                )
            }

            return result

        } catch (error: any) {

            if (browser) {
                const screenshot = await browser.takeScreenshot()
                allure.addAttachment(
                    'Assertion Failure Screenshot',
                    Buffer.from(screenshot, 'base64'),
                    'image/png'
                )
            }

            throw error
        }
    }

    // =========================================================
    // VISIBILITY
    // =========================================================

    static async assertVisible(locator: string, screenshot = false): Promise<void> {

        const element = await $(locator)
        await element.waitForDisplayed({ timeout: this.DEFAULT_TIMEOUT })

        return this.assertStep(
            { command: 'Assert Visible', locator, element, screenshotAfter: screenshot },
            async () => expect(await element.isDisplayed()).toBe(true)
        )
    }

    static async assertNotVisible(locator: string, screenshot = false): Promise<void> {

        const element = await $(locator)

        return this.assertStep(
            { command: 'Assert Not Visible', locator, element, screenshotAfter: screenshot },
            async () => expect(await element.isDisplayed()).toBe(false)
        )
    }

    static async assertNotPresent(locator: string): Promise<void> {

        return this.assertStep(
            { command: 'Assert Not Present', locator },
            async () => {
                const elements = await $$(locator)
                expect(elements.length).toBe(0)
            }
        )
    }

    // =========================================================
    // TEXT
    // =========================================================

    static async assertTextEquals(
        locator: string,
        expected: string,
        screenshot = false
    ): Promise<void> {

        const element = await $(locator)
        await element.waitForDisplayed({ timeout: this.DEFAULT_TIMEOUT })

        return this.assertStep(
            { command: 'Assert Text Equals', locator, element, expected, screenshotAfter: screenshot },
            async () => {
                const actual = (await element.getText()).trim()
                expect(actual).toBe(expected.trim())
            }
        )
    }

    // =========================================================
    // TEXT
    // =========================================================

    static async assertTextNotEquals(
        locator: string,
        expected: string,
        screenshot = false
    ): Promise<void> {

        const element = await $(locator)
        await element.waitForDisplayed({ timeout: this.DEFAULT_TIMEOUT })

        return this.assertStep(
            { command: 'Assert Text Equals', locator, element, expected, screenshotAfter: screenshot },
            async () => {
                const actual = (await element.getText()).trim()
                expect(actual).not.toBe(expected.trim())
            }
        )
    }

    static async assertTextContains(
        locator: string,
        expectedPart: string,
        screenshot = false
    ): Promise<void> {

        const element = await $(locator)
        await element.waitForDisplayed({ timeout: this.DEFAULT_TIMEOUT })

        return this.assertStep(
            { command: 'Assert Text Contains', locator, element, expected: expectedPart, screenshotAfter: screenshot },
            async () => {
                const actual = (await element.getText()).trim()
                expect(actual).toContain(expectedPart)
            }
        )
    }

    // =========================================================
    // VALUE
    // =========================================================

    static async assertValueEquals(
        locator: string,
        expected: string
    ): Promise<void> {

        const element = await $(locator)
        await element.waitForDisplayed({ timeout: this.DEFAULT_TIMEOUT })

        return this.assertStep(
            { command: 'Assert Value Equals', locator, expected },
            async () => {
                const actual = await element.getValue()
                expect(actual).toBe(expected)
            }
        )
    }


    static async assertValueContains(
        locator: string,
        expectedPart: string
    ): Promise<void> {

        const element = await $(locator)

        return this.assertStep(
            { command: 'Assert Value Contains', locator, expected: expectedPart },
            async () => {
                const actual = await element.getValue()
                expect(actual).toContain(expectedPart)
            }
        )
    }
///////////////////////////////

// =========================================================
// STRING - GREATER THAN
// =========================================================

static async assertStringIsGreaterThan(
    actual: string,
    expected: string
): Promise<void> {

    return this.assertStep(
        {
            command: 'Assert String Is Greater Than',
            expected: `${actual} > ${expected}`,
            displayLocator: AssertionHelper.normalizeLabel(actual) || AssertionHelper.normalizeLabel(expected)
        },
        async () => expect(actual > expected).toBe(true)
    )
}

// =========================================================
// STRING - EQUALS
// =========================================================

static async assertStringEquals(
    actual: string,
    expected: string
): Promise<void> {

    const normalize = (value: string) => (value ?? '').replace(/\s+/g, ' ').trim()
    const display = AssertionHelper.normalizeLabel(expected) || AssertionHelper.normalizeLabel(actual)

    return this.assertStep(
        {
            command: 'Assert String Equals',
            expected: expected,
            displayLocator: display
        },
        async () => {
            expect(normalize(actual)).toBe(normalize(expected));
        }
    );
}


// =========================================================
// STRING - NOT EQUALS
// =========================================================

static async assertStringNotEquals(
    actual: string,
    expected: string
): Promise<void> {

    const normalize = (value: string) => (value ?? '').replace(/\s+/g, ' ').trim()
    const display = AssertionHelper.normalizeLabel(expected) || AssertionHelper.normalizeLabel(actual)

    return this.assertStep(
        {
            command: 'Assert String Not Equals',
            expected: expected,
            displayLocator: display
        },
        async () => {
            expect(normalize(actual)).not.toBe(normalize(expected));
        }
    );
}
    // =========================================================
    // CHECKBOX / STATE
    // =========================================================

    static async assertChecked(locator: string): Promise<void> {

        const element = await $(locator)
        await element.waitForExist({ timeout: this.DEFAULT_TIMEOUT })

        return this.assertStep(
            { command: 'Assert Checked', locator },
            async () => expect(await element.isSelected()).toBe(true)
        )
    }

    static async assertNotChecked(locator: string): Promise<void> {

        const element = await $(locator)

        return this.assertStep(
            { command: 'Assert Not Checked', locator },
            async () => expect(await element.isSelected()).toBe(false)
        )
    }

    static async assertEnabled(locator: string): Promise<void> {

        const element = await $(locator)

        return this.assertStep(
            { command: 'Assert Enabled', locator },
            async () => expect(await element.isEnabled()).toBe(true)
        )
    }

    static async assertDisabled(locator: string): Promise<void> {

        const element = await $(locator)

        return this.assertStep(
            { command: 'Assert Disabled', locator },
            async () => expect(await element.isEnabled()).toBe(false)
        )
    }

    // =========================================================
    // COUNT
    // =========================================================

    static async assertCountEquals(
        locator: string,
        expectedCount: number
    ): Promise<void> {

        return this.assertStep(
            { command: 'Assert Count Equals', locator, expected: String(expectedCount) },
            async () => {
                const elements = await $$(locator)
                expect(elements.length).toBe(expectedCount)
            }
        )
    }

    static async assertCountGte(
        locator: string,
        minCount: number
    ): Promise<void> {

        return this.assertStep(
            { command: 'Assert Count >=', locator, expected: String(minCount) },
            async () => {
                const elements = await $$(locator)
                expect(elements.length).toBeGreaterThanOrEqual(minCount)
            }
        )
    }

    static async assertCountLte(
        locator: string,
        maxCount: number
    ): Promise<void> {

        return this.assertStep(
            { command: 'Assert Count <=', locator, expected: String(maxCount) },
            async () => {
                const elements = await $$(locator)
                expect(elements.length).toBeLessThanOrEqual(maxCount)
            }
        )
    }

    // =========================================================
    // URL & TITLE
    // =========================================================

    static async assertUrlContains(expected: string): Promise<void> {

        return this.assertStep(
            { command: 'Assert URL Contains', expected },
            async () => {
                const url = await browser.getUrl()
                expect(url).toContain(expected)
            }
        )
    }

    static async assertUrlEquals(expected: string): Promise<void> {

        return this.assertStep(
            { command: 'Assert URL Equals', expected },
            async () => {
                const url = await browser.getUrl()
                expect(url).toBe(expected)
            }
        )
    }

    static async assertTitleEquals(expected: string): Promise<void> {

        return this.assertStep(
            { command: 'Assert Title Equals', expected },
            async () => {
                const title = await browser.getTitle()
                expect(title).toBe(expected)
            }
        )
    }

    // =========================================================
    // ATTRIBUTE
    // =========================================================

    static async assertAttributeEquals(
        locator: string,
        attributeName: string,
        expected: string
    ): Promise<void> {

        const element = await $(locator)

        return this.assertStep(
            { command: 'Assert Attribute Equals', locator, element, expected },
            async () => {
                const attr = await element.getAttribute(attributeName)
                expect((attr ?? '').trim()).toBe(expected.trim())
            }
        )
    }

    static async assertAttributeContains(
        locator: string,
        attributeName: string,
        expectedPart: string
    ): Promise<void> {

        const element = await $(locator)

        return this.assertStep(
            { command: 'Assert Attribute Contains', locator, element, expected: expectedPart },
            async () => {
                const attr = await element.getAttribute(attributeName)
                expect(attr ?? '').toContain(expectedPart)
            }
        )
    }


    static async assertAllTextsContain(
    locator: string,
    expectedText: string
): Promise<void> {

    return this.assertStep(
        { command: 'Assert All Texts Contain', locator, expected: expectedText },
        async () => {

            const elements = await $$(locator); // ✅ IMPORTANT

            if (await elements.length === 0) {
                throw new Error('❌ No elements found');
            }

            const failures: string[] = [];

            for (let i = 0; i < await elements.length; i++) {

                const text = (await elements[i].getText()).toLowerCase();

                if (!text.includes(expectedText.toLowerCase())) {
                    failures.push(`Index ${i}: "${text}"`);
                }
            }

            expect(failures.length).toBe(0);
        }
    );
}

static async assertTrue(
    condition: boolean,
    message: string
): Promise<void> {

    return this.assertStep(
        {
            command: 'Assert True',
            expected: 'true',
            displayLocator: AssertionHelper.normalizeLabel(message)
        },
        async () => {

            if (!condition) {
                throw new Error(`❌ ${message}`);
            }

            expect(condition).toBe(true);
        }
    );
}


    // =========================================================
    // NUMERIC
    // =========================================================

    static async assertValueIsLessThan(
        actual: number,
        expected: number
    ): Promise<void> {

        return this.assertStep(
            { command: 'Assert Value Is Less Than', expected: `${actual} < ${expected}` },
            async () => expect(actual).toBeLessThan(expected)
        )
    }

    static async assertValueIsGreaterThan(
        actual: number,
        expected: number
    ): Promise<void> {

        return this.assertStep(
            { command: 'Assert Value Is Greater Than', expected: `${actual} > ${expected}` },
            async () => expect(actual).toBeGreaterThan(expected)
        )
    }

    static async assertValueApproximatelyEquals(
        actual: number,
        expected: number,
        tolerance: number = 1
    ): Promise<void> {

        return this.assertStep(
            { command: 'Assert Value Approximately Equals', expected: `${actual} ≈ ${expected} (±${tolerance})` },
            async () => expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance)
        )
    }

    static async assertEqual(actual: any, expected: any, message?: string): Promise<void> {
        const expectedLabel = AssertionHelper.normalizeLabel(String(expected))
        const display = AssertionHelper.normalizeLabel(message) || expectedLabel
        return this.assertStep(
            {
                command: 'Assert Equal',
                expected: expectedLabel ?? String(expected),
                displayLocator: display
            },
            async () => {
                if (actual !== expected) {
                    throw new Error(message || `Expected ${expected} but got ${actual}`)
                }
                expect(actual).toBe(expected)
            }
        )
    }
    static async verifyTrue(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(message || "Condition failed");
  }
}

static async verifyFalse(condition: boolean, message?: string) {
  if (condition) {
    throw new Error(message || "Condition expected to be false but was true");
  }
}


}






































































































// import allure from '@wdio/allure-reporter'

// interface CommandMeta {
//     command: string
//     locator?: string
//     expected?: string
//     screenshotAfter?: boolean
// }

// export default class AssertionHelper {

//     private static readonly DEFAULT_TIMEOUT = 10000

//     // =========================================================
//     // CORE ASSERT STEP ENGINE
//     // =========================================================
//     private static async assertStep<T>(
//         meta: CommandMeta,
//         action: () => Promise<T>
//     ): Promise<T> {

//         try {
//             allure.addStep(`${meta.command} - ${meta.locator || ''}`)

//             if (meta.expected) {
//                 allure.addAttachment(
//                     'Expected',
//                     meta.expected,
//                     'text/plain'
//                 )
//             }

//             const result = await action()

//             if (meta.screenshotAfter) {
//                 const screenshot = await browser.takeScreenshot()
//                 allure.addAttachment(
//                     `${meta.command} Screenshot`,
//                     Buffer.from(screenshot, 'base64'),
//                     'image/png'
//                 )
//             }

//             return result

//         } catch (error: any) {

//             if (browser) {
//                 const screenshot = await browser.takeScreenshot()
//                 allure.addAttachment(
//                     'Assertion Failure Screenshot',
//                     Buffer.from(screenshot, 'base64'),
//                     'image/png'
//                 )
//             }

//             throw error
//         }
//     }

//     // =========================================================
//     // VISIBILITY
//     // =========================================================

//     static async assertVisible(locator: string, screenshot = false): Promise<void> {

//         const element = await $(locator)
//         await element.waitForDisplayed({ timeout: this.DEFAULT_TIMEOUT })

//         return this.assertStep(
//             { command: 'Assert Visible', locator, screenshotAfter: screenshot },
//             async () => expect(await element.isDisplayed()).toBe(true)
//         )
//     }

//     static async assertNotVisible(locator: string, screenshot = false): Promise<void> {

//         const element = await $(locator)

//         return this.assertStep(
//             { command: 'Assert Not Visible', locator, screenshotAfter: screenshot },
//             async () => expect(await element.isDisplayed()).toBe(false)
//         )
//     }

//     static async assertNotPresent(locator: string): Promise<void> {

//         return this.assertStep(
//             { command: 'Assert Not Present', locator },
//             async () => {
//                 const elements = await $$(locator)
//                 expect(elements.length).toBe(0)
//             }
//         )
//     }

//     // =========================================================
//     // TEXT
//     // =========================================================

//     static async assertTextEquals(
//         locator: string,
//         expected: string,
//         screenshot = false
//     ): Promise<void> {

//         const element = await $(locator)
//         await element.waitForDisplayed({ timeout: this.DEFAULT_TIMEOUT })

//         return this.assertStep(
//             { command: 'Assert Text Equals', locator, expected, screenshotAfter: screenshot },
//             async () => {
//                 const actual = (await element.getText()).trim()
//                 expect(actual).toBe(expected.trim())
//             }
//         )
//     }

//     // =========================================================
//     // TEXT
//     // =========================================================

//     static async assertTextNotEquals(
//         locator: string,
//         expected: string,
//         screenshot = false
//     ): Promise<void> {

//         const element = await $(locator)
//         await element.waitForDisplayed({ timeout: this.DEFAULT_TIMEOUT })

//         return this.assertStep(
//             { command: 'Assert Text Equals', locator, expected, screenshotAfter: screenshot },
//             async () => {
//                 const actual = (await element.getText()).trim()
//                 expect(actual).not.toBe(expected.trim())
//             }
//         )
//     }

//     static async assertTextContains(
//         locator: string,
//         expectedPart: string,
//         screenshot = false
//     ): Promise<void> {

//         const element = await $(locator)
//         await element.waitForDisplayed({ timeout: this.DEFAULT_TIMEOUT })

//         return this.assertStep(
//             { command: 'Assert Text Contains', locator, expected: expectedPart, screenshotAfter: screenshot },
//             async () => {
//                 const actual = (await element.getText()).trim()
//                 expect(actual).toContain(expectedPart)
//             }
//         )
//     }

//     // =========================================================
//     // VALUE
//     // =========================================================

//     static async assertValueEquals(
//         locator: string,
//         expected: string
//     ): Promise<void> {

//         const element = await $(locator)
//         await element.waitForDisplayed({ timeout: this.DEFAULT_TIMEOUT })

//         return this.assertStep(
//             { command: 'Assert Value Equals', locator, expected },
//             async () => {
//                 const actual = await element.getValue()
//                 expect(actual).toBe(expected)
//             }
//         )
//     }


//     static async assertValueContains(
//         locator: string,
//         expectedPart: string
//     ): Promise<void> {

//         const element = await $(locator)

//         return this.assertStep(
//             { command: 'Assert Value Contains', locator, expected: expectedPart },
//             async () => {
//                 const actual = await element.getValue()
//                 expect(actual).toContain(expectedPart)
//             }
//         )
//     }
// ///////////////////////////////

// // =========================================================
// // STRING - GREATER THAN
// // =========================================================

// static async assertStringIsGreaterThan(
//     actual: string,
//     expected: string
// ): Promise<void> {

//     return this.assertStep(
//         {
//             command: 'Assert String Is Greater Than',
//             expected: `${actual} > ${expected}`
//         },
//         async () => expect(actual > expected).toBe(true)
//     )
// }

// // =========================================================
// // STRING - EQUALS
// // =========================================================

// static async assertStringEquals(
//     actual: string,
//     expected: string
// ): Promise<void> {

//     const normalize = (value: string) => (value ?? '').replace(/\s+/g, ' ').trim()

//     return this.assertStep(
//         {
//             command: 'Assert String Equals',
//             expected: expected
//         },
//         async () => {
//             expect(normalize(actual)).toBe(normalize(expected));
//         }
//     );
// }


// // =========================================================
// // STRING - NOT EQUALS
// // =========================================================

// static async assertStringNotEquals(
//     actual: string,
//     expected: string
// ): Promise<void> {

//     const normalize = (value: string) => (value ?? '').replace(/\s+/g, ' ').trim()

//     return this.assertStep(
//         {
//             command: 'Assert String Not Equals',
//             expected: expected
//         },
//         async () => {
//             expect(normalize(actual)).not.toBe(normalize(expected));
//         }
//     );
// }
//     // =========================================================
//     // CHECKBOX / STATE
//     // =========================================================

//     static async assertChecked(locator: string): Promise<void> {

//         const element = await $(locator)
//         await element.waitForExist({ timeout: this.DEFAULT_TIMEOUT })

//         return this.assertStep(
//             { command: 'Assert Checked', locator },
//             async () => expect(await element.isSelected()).toBe(true)
//         )
//     }

//     static async assertNotChecked(locator: string): Promise<void> {

//         const element = await $(locator)

//         return this.assertStep(
//             { command: 'Assert Not Checked', locator },
//             async () => expect(await element.isSelected()).toBe(false)
//         )
//     }

//     static async assertEnabled(locator: string): Promise<void> {

//         const element = await $(locator)

//         return this.assertStep(
//             { command: 'Assert Enabled', locator },
//             async () => expect(await element.isEnabled()).toBe(true)
//         )
//     }

//     static async assertDisabled(locator: string): Promise<void> {

//         const element = await $(locator)

//         return this.assertStep(
//             { command: 'Assert Disabled', locator },
//             async () => expect(await element.isEnabled()).toBe(false)
//         )
//     }

//     // =========================================================
//     // COUNT
//     // =========================================================

//     static async assertCountEquals(
//         locator: string,
//         expectedCount: number
//     ): Promise<void> {

//         return this.assertStep(
//             { command: 'Assert Count Equals', locator, expected: String(expectedCount) },
//             async () => {
//                 const elements = await $$(locator)
//                 expect(elements.length).toBe(expectedCount)
//             }
//         )
//     }

//     static async assertCountGte(
//         locator: string,
//         minCount: number
//     ): Promise<void> {

//         return this.assertStep(
//             { command: 'Assert Count >=', locator, expected: String(minCount) },
//             async () => {
//                 const elements = await $$(locator)
//                 expect(elements.length).toBeGreaterThanOrEqual(minCount)
//             }
//         )
//     }

//     static async assertCountLte(
//         locator: string,
//         maxCount: number
//     ): Promise<void> {

//         return this.assertStep(
//             { command: 'Assert Count <=', locator, expected: String(maxCount) },
//             async () => {
//                 const elements = await $$(locator)
//                 expect(elements.length).toBeLessThanOrEqual(maxCount)
//             }
//         )
//     }

//     // =========================================================
//     // URL & TITLE
//     // =========================================================

//     static async assertUrlContains(expected: string): Promise<void> {

//         return this.assertStep(
//             { command: 'Assert URL Contains', expected },
//             async () => {
//                 const url = await browser.getUrl()
//                 expect(url).toContain(expected)
//             }
//         )
//     }

//     static async assertUrlEquals(expected: string): Promise<void> {

//         return this.assertStep(
//             { command: 'Assert URL Equals', expected },
//             async () => {
//                 const url = await browser.getUrl()
//                 expect(url).toBe(expected)
//             }
//         )
//     }

//     static async assertTitleEquals(expected: string): Promise<void> {

//         return this.assertStep(
//             { command: 'Assert Title Equals', expected },
//             async () => {
//                 const title = await browser.getTitle()
//                 expect(title).toBe(expected)
//             }
//         )
//     }

//     // =========================================================
//     // ATTRIBUTE
//     // =========================================================

//     static async assertAttributeEquals(
//         locator: string,
//         attributeName: string,
//         expected: string
//     ): Promise<void> {

//         const element = await $(locator)

//         return this.assertStep(
//             { command: 'Assert Attribute Equals', locator, expected },
//             async () => {
//                 const attr = await element.getAttribute(attributeName)
//                 expect((attr ?? '').trim()).toBe(expected.trim())
//             }
//         )
//     }

//     static async assertAttributeContains(
//         locator: string,
//         attributeName: string,
//         expectedPart: string
//     ): Promise<void> {

//         const element = await $(locator)

//         return this.assertStep(
//             { command: 'Assert Attribute Contains', locator, expected: expectedPart },
//             async () => {
//                 const attr = await element.getAttribute(attributeName)
//                 expect(attr ?? '').toContain(expectedPart)
//             }
//         )
//     }


//     static async assertAllTextsContain(
//     locator: string,
//     expectedText: string
// ): Promise<void> {

//     return this.assertStep(
//         { command: 'Assert All Texts Contain', locator, expected: expectedText },
//         async () => {

//             const elements = await $$(locator); // ✅ IMPORTANT

//             if (await elements.length === 0) {
//                 throw new Error('❌ No elements found');
//             }

//             const failures: string[] = [];

//             for (let i = 0; i < await elements.length; i++) {

//                 const text = (await elements[i].getText()).toLowerCase();

//                 if (!text.includes(expectedText.toLowerCase())) {
//                     failures.push(`Index ${i}: "${text}"`);
//                 }
//             }

//             expect(failures.length).toBe(0);
//         }
//     );
// }

// static async assertTrue(
//     condition: boolean,
//     message: string
// ): Promise<void> {

//     return this.assertStep(
//         { command: 'Assert True', expected: 'true' }, // ✅ string
//         async () => {

//             if (!condition) {
//                 throw new Error(`❌ ${message}`);
//             }

//             expect(condition).toBe(true);
//         }
//     );
// }


//     // =========================================================
//     // NUMERIC
//     // =========================================================

//     static async assertValueIsLessThan(
//         actual: number,
//         expected: number
//     ): Promise<void> {

//         return this.assertStep(
//             { command: 'Assert Value Is Less Than', expected: `${actual} < ${expected}` },
//             async () => expect(actual).toBeLessThan(expected)
//         )
//     }

//     static async assertValueIsGreaterThan(
//         actual: number,
//         expected: number
//     ): Promise<void> {

//         return this.assertStep(
//             { command: 'Assert Value Is Greater Than', expected: `${actual} > ${expected}` },
//             async () => expect(actual).toBeGreaterThan(expected)
//         )
//     }

//     static async assertValueApproximatelyEquals(
//         actual: number,
//         expected: number,
//         tolerance: number = 1
//     ): Promise<void> {

//         return this.assertStep(
//             { command: 'Assert Value Approximately Equals', expected: `${actual} ≈ ${expected} (±${tolerance})` },
//             async () => expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance)
//         )
//     }

//     static async assertEqual(actual: any, expected: any, message?: string) {
//   if (actual !== expected) {
//     throw new Error(message || `Expected ${expected} but got ${actual}`)
//   }
// }


// }

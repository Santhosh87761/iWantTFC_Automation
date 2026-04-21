import allure from '@wdio/allure-reporter'
import { Status } from 'allure-js-commons'

type ElementLike = WebdriverIO.Element | ReturnType<typeof $>

interface CommandMeta {
    command: string
    locator?: string
    displayLocator?: string
    input?: string
    screenshotAfter?: boolean
    element?: ElementLike
}

export default class ElementHelper {

    private static readonly DEFAULT_TIMEOUT = 10000

    private static isNativeApp(): boolean {
        return Boolean((driver as WebdriverIO.Browser).isAndroid || (driver as WebdriverIO.Browser).isIOS)
    }

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
        const v = ElementHelper.normalizeLabel(locator)
        if (!v) return undefined

        if (v.startsWith('~')) {
            return ElementHelper.normalizeLabel(v.slice(1))
        }

        const exactTextMatch =
            v.match(/@(?:text|content-desc|aria-label|alt|title|placeholder|name|label|resource-id)\s*=\s*["']([^"']+)["']/i) ||
            v.match(/\[(?:text|content-desc|aria-label|alt|title|placeholder|name|label|resource-id)\s*=\s*["']([^"']+)["']/i) ||
            v.match(/text\(\)\s*=\s*["']([^"']+)["']/i)
        if (exactTextMatch?.[1]) return ElementHelper.normalizeLabel(exactTextMatch[1])

        const containsTextMatch =
            v.match(/contains\(\s*@(?:text|content-desc|aria-label|alt|title|placeholder|name|label|resource-id)\s*,\s*["']([^"']+)["']\s*\)/i) ||
            v.match(/contains\(\s*text\(\)\s*,\s*["']([^"']+)["']\s*\)/i) ||
            v.match(/contains\(\s*\.\s*,\s*["']([^"']+)["']\s*\)/i)
        if (containsTextMatch?.[1]) return ElementHelper.normalizeLabel(containsTextMatch[1])

        const cssAttrMatch =
            v.match(/\[(?:aria-label|alt|title|placeholder|name|label|data-testid|resource-id)\s*\*?=\s*["']([^"']+)["'][^\]]*\]/i)
        if (cssAttrMatch?.[1]) return ElementHelper.normalizeLabel(cssAttrMatch[1])

        const uiAutomatorMatch =
            v.match(/\b(?:text|textContains|textMatches|description|descriptionContains|descriptionMatches)\(\"([^\"]+)\"\)/i)
        if (uiAutomatorMatch?.[1]) return ElementHelper.normalizeLabel(uiAutomatorMatch[1])

        return undefined
    }

    private static async resolveElementLabel(element: ElementLike, locator?: string): Promise<string | undefined> {
        const el = await (element as WebdriverIO.Element)
        try {
            const text = ElementHelper.normalizeLabel(await el.getText())
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
                const v = ElementHelper.normalizeLabel(await el.getAttribute(attr))
                if (v) return v
            } catch {
                // ignore
            }
        }

        if (locator) {
            const m =
                locator.match(/@(?:text|content-desc|name|aria-label|alt|title)\s*=\s*["']([^"']+)["']/i) ||
                locator.match(/\[(?:text|content-desc|name|aria-label|alt|title)\s*=\s*["']([^"']+)["']/i)
            if (m?.[1]) {
                return ElementHelper.normalizeLabel(m[1])
            }
        }

        return undefined
    }

    private static shortenLocator(locator?: string): string | undefined {
        const v = ElementHelper.normalizeLabel(locator)
        if (!v) return undefined

        const extracted = ElementHelper.extractLabelFromLocator(v)
        if (extracted) return extracted

        // Extract the most useful bit from common selectors.
        const idMatch = v.match(/@id\s*=\s*["']([^"']+)["']/i) || v.match(/#([A-Za-z0-9_-]+)/)
        if (idMatch?.[1]) return `#${idMatch[1]}`

        const textMatch =
            v.match(/@(?:text|content-desc|aria-label|alt|title)\s*=\s*["']([^"']+)["']/i) ||
            v.match(/\[(?:text|content-desc|aria-label|alt|title)\s*=\s*["']([^"']+)["']/i)
        if (textMatch?.[1]) return ElementHelper.normalizeLabel(textMatch[1])

        const classMatch = v.match(/@class\s*=\s*["']([^"']+)["']/i) || v.match(/\.([A-Za-z0-9_-]+)/)
        if (classMatch?.[1]) return `.${classMatch[1].split(/\s+/)[0]}`

        return v
    }

    // ==========================================
    // Central Command Wrapper (CORE ENGINE)
    // ==========================================
    private static async commandStep(
        meta: CommandMeta,
        action: () => Promise<any>
    ): Promise<any> {

        try {
            const resolvedDisplay =
                meta.displayLocator ||
                (meta.element ? await ElementHelper.resolveElementLabel(meta.element, meta.locator) : undefined) ||
                ElementHelper.shortenLocator(meta.locator) ||
                meta.locator ||
                ''

            allure.addStep(resolvedDisplay ? `${meta.command} - ${resolvedDisplay}` : meta.command)

            if (meta.input) {
                allure.addStep(`Input: ${meta.input}`)
            }

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
            allure.addStep(`❌ Failed: ${meta.command}`)
            throw error
        }
    }

    // ==========================================
    // CLICK METHODS
    // ==========================================

    
    // import allure from '@wdio/allure-reporter';

static async cmdClick(
    locator: string,
    validationText: string,
    timeout: number = 10000
): Promise<void> {
    try {
        const element = await $(locator);
        await element.waitForDisplayed({ timeout:10000});
        await element.waitForClickable({ timeout:10000});
        const friendlyName = ElementHelper.extractLabelFromLocator(locator) || validationText;
        await element.click();
        const successMessage = `✓ Successfully clicked on "${friendlyName}"`;
        console.log(successMessage);
        allure.addStep(successMessage);
    } catch (error) {
        const friendlyName = ElementHelper.extractLabelFromLocator(locator) || validationText;
        const errorMessage = `✗ Failed to click on "${friendlyName}"`;
        const screenshot = await browser.takeScreenshot();
        allure.addAttachment('Click Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');
        console.error(errorMessage, error);
        allure.addStep(errorMessage, {}, Status.FAILED);
        throw error;
    }
} 

// =========================================================
// MOUSE HOVER
// =========================================================

static async cmdMouseHover(locator: string): Promise<void> {
    return ElementHelper.commandStep(
        { command: 'Hover Over', locator },
        async () => {
            const element = await $(locator);
            await element.waitForExist({ timeout: 10000 });
            await element.moveTo();
        }
    );
}

static async hoverVideoCenter(): Promise<void> {
    return ElementHelper.commandStep(
        { command: 'Hover Over Video Center' },
        async () => {
            const video = await $('.player-video-controls');
            const size = await video.getSize();
            const location = await video.getLocation();
            const centerX = location.x + Math.floor(size.width / 2);
            const centerY = location.y + Math.floor(size.height / 2);
            await browser.performActions([{
                type: 'pointer',
                id: 'mouse',
                parameters: { pointerType: 'mouse' },
                actions: [{
                    type: 'pointerMove',
                    duration: 300,
                    x: centerX,
                    y: centerY
                }]
            }]);
        }
    );
}

static async cmdJsClick(locator: string): Promise<void> {
        try {
            const element = await $(locator)
            await element.waitForDisplayed()

            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'element';

            await browser.execute((el) => el.click(), element)

            const successMessage = `✓ Successfully clicked (via JS) on "${friendlyName}"`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'element';
            const errorMessage = `✗ Failed to click (via JS) on "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('JS Click Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    static async cmdGetElementCount(locator: string): Promise<number> {
        try {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'elements';
            allure.addStep(`📊 Counting: ${friendlyName}`);

            const count = (await $$(locator)).length

            const successMessage = `✓ Found ${count} matching element(s)`;
            console.log(successMessage);
            allure.addStep(successMessage);

            return count;

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'elements';
            const errorMessage = `✗ Failed to count "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Get Count Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    // ==========================================
    // INPUT METHODS
    // ==========================================

    static async cmdFill(
        locator: string,
        value: string,
        timeout: number = ElementHelper.DEFAULT_TIMEOUT
    ): Promise<void> {
        try {
            const element = await $(locator)
            await element.waitForDisplayed({ timeout })

            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'text field';

            await element.setValue(value)

            const successMessage = `✓ Successfully entered "${friendlyName}" with value: ${value}`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'text field';
            const errorMessage = `✗ Failed to enter value into "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Enter Value Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    static async cmdClear(locator: string): Promise<void> {
        try {
            const element = await $(locator)
            await element.waitForDisplayed()

            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'field';

            await element.clearValue()

            const successMessage = `✓ Successfully cleared "${friendlyName}"`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'field';
            const errorMessage = `✗ Failed to clear "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Clear Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    static async cmdPress(locator: string, key: string): Promise<void> {
        try {
            const element = await $(locator)
            await element.waitForDisplayed()

            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'element';

            await element.click()
            await browser.keys(key)

            const successMessage = `✓ Successfully pressed "${key}" on "${friendlyName}"`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'element';
            const errorMessage = `✗ Failed to press key on "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Press Key Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    // ==========================================
    // CHECKBOX / RADIO
    // ==========================================

    static async cmdCheck(locator: string): Promise<void> {
        try {
            const element = await $(locator)
            await element.waitForDisplayed()

            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'checkbox';

            if (!(await element.isSelected())) {
                await element.click()
            }

            const successMessage = `✓ Successfully checked "${friendlyName}"`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'checkbox';
            const errorMessage = `✗ Failed to check "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Check Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    static async cmdUncheck(locator: string): Promise<void> {
        try {
            const element = await $(locator)
            await element.waitForDisplayed()

            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'checkbox';

            if (await element.isSelected()) {
                await element.click()
            }

            const successMessage = `✓ Successfully unchecked "${friendlyName}"`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'checkbox';
            const errorMessage = `✗ Failed to uncheck "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Uncheck Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    static async cmdIsChecked(
        locator: string,
        timeout: number = ElementHelper.DEFAULT_TIMEOUT
    ): Promise<boolean> {
        try {
            const element = await $(locator)
            await element.waitForExist({ timeout })

            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'checkbox';

            const isChecked = await element.isSelected()

            const status = isChecked ? 'checked' : 'unchecked';
            const successMessage = `✓ "${friendlyName}" is ${status}`;
            console.log(successMessage);
            allure.addStep(successMessage);

            return isChecked;

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'checkbox';
            const errorMessage = `✗ Failed to check state of "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Check Status Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    // ==========================================
    // DROPDOWN
    // ==========================================

    static async cmdSelectByText(locator: string, text: string): Promise<void> {
        try {
            const element = await $(locator)
            await element.waitForDisplayed()

            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'dropdown';

            await element.selectByVisibleText(text)

            const successMessage = `✓ Successfully selected "${text}" from "${friendlyName}"`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'dropdown';
            const errorMessage = `✗ Failed to select "${text}" from "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Select Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    static async cmdSelectByValue(locator: string, value: string): Promise<void> {
        try {
            const element = await $(locator)
            await element.waitForDisplayed()

            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'dropdown';

            await element.selectByAttribute('value', value)

            const successMessage = `✓ Successfully selected value "${value}" from "${friendlyName}"`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'dropdown';
            const errorMessage = `✗ Failed to select value "${value}" from "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Select Value Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

static async dragToEnd(
    progressBarLocator: string,
    scrubberLocator: string
): Promise<void> {
    return ElementHelper.commandStep(
        { command: 'Drag Progress Bar to End' },
        async () => {
            const progressBar = await $(progressBarLocator);
            const scrubber = await $(scrubberLocator);

            await progressBar.waitForDisplayed({ timeout: 10000 });

            const barLocation = await progressBar.getLocation();
            const barSize = await progressBar.getSize();

            // Calculate end position (near the end of the progress bar)
            const endX = barLocation.x + barSize.width - 5;
            const centerY = barLocation.y + (barSize.height / 2);

            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'mouse',
                    parameters: { pointerType: 'mouse' },
                    actions: [
                        {
                            type: 'pointerMove',
                            duration: 0,
                            origin: scrubber,
                            x: 0,
                            y: 0
                        },
                        { type: 'pointerDown', button: 0 },
                        {
                            type: 'pointerMove',
                            duration: 800,
                            origin: 'viewport',
                            x: Math.floor(endX),
                            y: Math.floor(centerY)
                        },
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);

            await browser.releaseActions();
        }
    );
}

static async dragToMid(
    progressBarLocator: string,
    scrubberLocator: string
): Promise<void> {
    return ElementHelper.commandStep(
        { command: 'Drag Progress Bar to Middle' },
        async () => {
            await ElementHelper.dragToEnd(progressBarLocator, scrubberLocator)
        }
    );
}

static async dragMidToStart(
    progressBarLocator: string,
    scrubberLocator: string
): Promise<void> {
    return ElementHelper.commandStep(
        { command: 'Drag Progress Bar from Middle to Start' },
        async () => {
            const progressBar = await $(progressBarLocator);
            const scrubber = await $(scrubberLocator);

            await progressBar.waitForDisplayed({ timeout: 10000 });

            const barLocation = await progressBar.getLocation();
            const barSize = await progressBar.getSize();

            // midpoint of progress bar
            const midX = barLocation.x + (barSize.width / 2);

            // start position
            const startX = barLocation.x + 2;

            const centerY = barLocation.y + (barSize.height / 2);

            // Move scrubber to mid first
            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'mouse',
                    parameters: { pointerType: 'mouse' },
                    actions: [

                        {
                            type: 'pointerMove',
                            duration: 0,
                            origin: 'viewport',
                            x: Math.floor(midX),
                            y: Math.floor(centerY)
                        },

                        { type: 'pointerDown', button: 0 },

                        {
                            type: 'pointerMove',
                            duration: 800,
                            origin: 'viewport',
                            x: Math.floor(startX),
                            y: Math.floor(centerY)
                        },

                        { type: 'pointerUp', button: 0 }

                    ]
                }
            ]);

            await browser.releaseActions();
        }
    );
}

// =========================================================
// HORIZONTAL DRAG FROM START TO MID
// =========================================================

static async dragToMidFromStart(
    progressBarLocator: string,
    scrubberLocator: string
): Promise<void> {
    return ElementHelper.commandStep(
        { command: 'Drag Progress Bar from Start to Middle' },
        async () => {
            const progressBar = await $(progressBarLocator);
            const scrubber = await $(scrubberLocator);

            await progressBar.waitForDisplayed({ timeout: 10000 });

            const barLocation = await progressBar.getLocation();
            const barSize = await progressBar.getSize();

            // Calculate mid position
            const midX = barLocation.x + (barSize.width / 2);
            const centerY = barLocation.y + (barSize.height / 2);

            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'mouse',
                    parameters: { pointerType: 'mouse' },
                    actions: [
                        {
                            type: 'pointerMove',
                            duration: 0,
                            origin: scrubber,
                            x: 0,
                            y: 0
                        },
                        { type: 'pointerDown', button: 0 },
                        {
                            type: 'pointerMove',
                            duration: 800,
                            origin: 'viewport',
                            x: Math.floor(midX),
                            y: Math.floor(centerY)
                        },
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);

            await browser.releaseActions();
        }
    );
}
    // ==========================================
    // GET METHODS
    // ==========================================

    static async cmdGetText(locator: string): Promise<string> {
        try {
            const element = await $(locator)
            await element.waitForDisplayed()

            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'element';

            const text = (await element.getText()).trim()

            const successMessage = `✓ Retrieved text from "${friendlyName}": "${text}"`;
            console.log(successMessage);
            allure.addStep(successMessage);

            return text;

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'element';
            const errorMessage = `✗ Failed to get text from "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Get Text Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    static async cmdGetValue(locator: string): Promise<string> {
        try {
            const element = await $(locator)

            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'element';

            const value = await element.getValue()

            const successMessage = `✓ Retrieved value from "${friendlyName}": "${value}"`;
            console.log(successMessage);
            allure.addStep(successMessage);

            return value;

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'element';
            const errorMessage = `✗ Failed to get value from "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Get Value Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    static async cmdGetCount(locator: string): Promise<number> {
        try {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'elements';
            allure.addStep(`📊 Counting: ${friendlyName}`);

            const count = (await $$(locator)).length

            const successMessage = `✓ Found ${count} matching element(s)`;
            console.log(successMessage);
            allure.addStep(successMessage);

            return count;

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'elements';
            const errorMessage = `✗ Failed to count "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Get Count Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    static async cmdGetAllTexts(locator: string): Promise<string[]> {
        try {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'elements';

            const elements = await $$(locator)
            const texts: string[] = []
            for (const el of elements) {
                texts.push((await el.getText()).trim())
            }

            const successMessage = `✓ Retrieved ${texts.length} text value(s) from "${friendlyName}"`;
            console.log(successMessage);
            allure.addStep(successMessage);

            return texts;

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'elements';
            const errorMessage = `✗ Failed to get all texts from "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Get All Texts Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    // ==========================================
    // VISIBILITY
    // ==========================================

    static async cmdIsVisible(locator: string): Promise<boolean> {
        try {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'element';

            const isVisible = await (async () => {
                try {
                    const element = await $(locator)
                    return await element.isDisplayed()
                } catch {
                    return false
                }
            })()

            const status = isVisible ? 'visible' : 'not visible';
            const successMessage = `✓ "${friendlyName}" is ${status}`;
            console.log(successMessage);
            allure.addStep(successMessage);

            return isVisible;

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'element';
            const errorMessage = `✗ Failed to check visibility of "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Visibility Check Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    // ==========================================
    // HOVER / SCROLL
    // ==========================================

    static async cmdHover(locator: string): Promise<void> {
        try {
            const element = await $(locator)
            await element.waitForDisplayed()

            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'element';

            await element.moveTo()

            const successMessage = `✓ Successfully hovered over "${friendlyName}"`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'element';
            const errorMessage = `✗ Failed to hover over "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Hover Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    static async cmdScrollIntoView(locator: string): Promise<void> {
        try {
            const element = await $(locator)

            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'element';

            await element.scrollIntoView()

            const successMessage = `✓ Successfully scrolled "${friendlyName}" into view`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'element';
            const errorMessage = `✗ Failed to scroll "${friendlyName}" into view`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Scroll Into View Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    // ==========================================
    // FILE UPLOAD
    // ==========================================

    static async cmdUploadFile(locator: string, filePath: string): Promise<void> {
        try {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'file input';

            const remotePath = await browser.uploadFile(filePath)
            const input = await $(locator)
            await input.setValue(remotePath)

            const successMessage = `✓ Successfully uploaded file to "${friendlyName}": ${filePath}`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(locator) || 'file input';
            const errorMessage = `✗ Failed to upload file to "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('File Upload Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    // ==========================================
    // WINDOW / TAB
    // ==========================================



    static async cmdSwitchToWindow(index: number): Promise<void> {
        try {
            const handles = await browser.getWindowHandles()
            await browser.switchToWindow(handles[index])

            const successMessage = `✓ Successfully switched to window #${index}`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const errorMessage = `✗ Failed to switch to window #${index}`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Switch Window Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    static async cmdCloseCurrentTab(): Promise<void> {
        try {
            await browser.closeWindow()

            const successMessage = `✓ Successfully closed current tab`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const errorMessage = `✗ Failed to close current tab`;

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    // ==========================================
    // KEYBOARD
    // ==========================================

    static async cmdKeyboardType(text: string): Promise<void> {
        try {
            await browser.keys(text)

            const successMessage = `✓ Successfully typed: ${text}`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const errorMessage = `✗ Failed to type text`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Keyboard Type Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    static async cmdKeyboardShortcut(keys: string[]): Promise<void> {
        try {
            const shortcut = keys.join(' + ');

            await browser.keys(keys)

            const successMessage = `✓ Successfully pressed keyboard shortcut: ${shortcut}`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const shortcut = keys.join(' + ');
            const errorMessage = `✗ Failed to press: ${shortcut}`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Keyboard Shortcut Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    // ==========================================
    // PAUSE
    // ==========================================

    static async cmdPause(milliseconds: number): Promise<void> {
        try {
            const seconds = (milliseconds / 1000).toFixed(2);

            await browser.pause(milliseconds)

            const successMessage = `✓ Paused execution for ${seconds} seconds`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const errorMessage = `✗ Failed during pause`;

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    // ---------------------------
    // Backwards-compatible aliases
    // ---------------------------

    static async isElementPresent(selector: string): Promise<boolean> {
        try {
            const friendlyName = ElementHelper.extractLabelFromLocator(selector) || 'element';
            allure.addStep(`🔍 Checking if present: ${friendlyName}`);

            const count = await ElementHelper.cmdGetCount(selector)
            const isPresent = (count ?? 0) > 0

            const message = isPresent 
                ? `✓ "${friendlyName}" is present (found ${count})`
                : `✓ "${friendlyName}" is not present`;
            console.log(message);
            allure.addStep(message);

            return isPresent;

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(selector) || 'element';
            const errorMessage = `✗ Failed to check if "${friendlyName}" is present`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Element Present Check Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            return false;
        }
    }

    static async isElementVisible(selector: string): Promise<boolean> {
        return ElementHelper.cmdIsVisible(selector)
    }

    static async isElementEnabled(selector: string): Promise<boolean> {
        try {
            const friendlyName = ElementHelper.extractLabelFromLocator(selector) || 'element';
            allure.addStep(`⚙️ Checking if enabled: ${friendlyName}`);

            const el = await $(selector)
            const isEnabled = await el.isEnabled()

            const status = isEnabled ? 'enabled' : 'disabled';
            const message = `✓ "${friendlyName}" is ${status}`;
            console.log(message);
            allure.addStep(message);

            return isEnabled;

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(selector) || 'element';
            const errorMessage = `✗ Failed to check if "${friendlyName}" is enabled`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Element Enabled Check Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            return false;
        }
    }

    static async safeType(selector: string, text: string, clearFirst: boolean = true): Promise<void> {
        try {
            const friendlyName = ElementHelper.extractLabelFromLocator(selector) || 'field';
            const action = clearFirst ? 'Clearing and typing' : 'Typing';
            allure.addStep(`📝 ${action} into: ${friendlyName}`);
            allure.addStep(`Text: ${text}`);

            if (clearFirst) {
                await ElementHelper.cmdClear(selector)
            }
            await ElementHelper.cmdFill(selector, text)

            const successMessage = `✓ Successfully typed text into "${friendlyName}"`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(selector) || 'field';
            const errorMessage = `✗ Failed to type into "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Safe Type Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    static async getTextWithRetry(selector: string, retries: number = 3): Promise<string> {
        try {
            const friendlyName = ElementHelper.extractLabelFromLocator(selector) || 'element';
            allure.addStep(`📖 Getting text with retry: ${friendlyName}`);
            allure.addStep(`Retries: ${retries}`);

            for (let i = 0; i < retries; i++) {
                try {
                    const text = await ElementHelper.cmdGetText(selector)
                    const successMessage = `✓ Retrieved text on attempt ${i + 1}: "${text}"`;
                    console.log(successMessage);
                    allure.addStep(successMessage);
                    return text
                } catch (e) {
                    if (i === retries - 1) {
                        throw e
                    }
                    await browser.pause(250)
                }
            }
            return ''

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(selector) || 'element';
            const errorMessage = `✗ Failed to get text from "${friendlyName}" after ${retries} retries`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Get Text With Retry Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            return '';
        }
    }

    static async waitUntilTextChanges(locator: string, oldText: string, timeout = 15000): Promise<void> {
        return ElementHelper.commandStep(
            { command: 'Wait Until Text Changes', locator, input: oldText },
            async () => {
                await browser.waitUntil(
                    async () => {
                        const newText = await this.cmdGetText(locator);
                        return newText.trim() !== oldText.trim();
                    },
                    {
                        timeout,
                        interval: 500,
                        timeoutMsg: `Text did not change from "${oldText}"`
                    }
                );
            }
        );
    }

    static async setCheckbox(selector: string, checked: boolean): Promise<void> {
        try {
            const friendlyName = ElementHelper.extractLabelFromLocator(selector) || 'checkbox';
            const action = checked ? 'Checking' : 'Unchecking';
            allure.addStep(`${checked ? '☑️' : '☐'} ${action}: ${friendlyName}`);

            if (checked) {
                await ElementHelper.cmdCheck(selector)
            } else {
                await ElementHelper.cmdUncheck(selector)
            }

            const status = checked ? 'checked' : 'unchecked';
            const successMessage = `✓ Successfully set "${friendlyName}" to ${status}`;
            console.log(successMessage);
            allure.addStep(successMessage);

        } catch (error) {
            const friendlyName = ElementHelper.extractLabelFromLocator(selector) || 'checkbox';
            const errorMessage = `✗ Failed to set "${friendlyName}"`;

            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Set Checkbox Error - Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            console.error(errorMessage, error);
            allure.addStep(errorMessage, {}, Status.FAILED);

            throw error;
        }
    }

    // Backwards-compatible aliases for old method names
    static async selectByText(selector: string, text: string): Promise<void> {
        return ElementHelper.cmdSelectByText(selector, text)
    }

    static async uploadFile(selector: string, filePath: string): Promise<void> {
        return ElementHelper.cmdUploadFile(selector, filePath)
    }
static async waitForLoader(loaderLocator: string): Promise<void> {
    return ElementHelper.commandStep(
        { command: 'Wait For Loader to Disappear', locator: loaderLocator },
        async () => {
            const loader = await $(loaderLocator);
            if (await loader.isDisplayed().catch(() => false)) {
                await loader.waitForDisplayed({ reverse: true, timeout: 20000 });
            }
        }
    );
}

// =========================================================
// SWITCH TO NEW TAB AND OPEN URL
// =========================================================

static async switchToNewTabAndLaunchUrl(url: string): Promise<void> {
    return ElementHelper.commandStep(
        { command: 'Open New Tab', input: url },
        async () => {
            const parent = await browser.getWindowHandle();

            // open blank tab
            await browser.execute(() => window.open());

            const handles = await browser.getWindowHandles();

            const newTab = handles.find(h => h !== parent);

            if (newTab) {
                await browser.switchToWindow(newTab);
                await browser.url(url);
            }
        }
    );
}
// =========================================================
// GET COPIED TEXT FROM CLIPBOARD
// =========================================================

static async getCopiedText(): Promise<string> {
    return ElementHelper.commandStep(
        { command: 'Get Text from Clipboard' },
        async () => {
            await browser.execute(() => {
                const input = document.createElement('input');
                input.id = 'tempClipboardInput';
                document.body.appendChild(input);
                input.focus();
            });

            const input = await $('#tempClipboardInput');

            await browser.keys(['Control', 'v']);

            const value = await input.getValue();

            await browser.execute(() => {
                const el = document.getElementById('tempClipboardInput');
                if (el) el.remove();
            });

            return value;
        }
    );
}

static async switchBackToParentAndCloseChild(): Promise<void> {
    return ElementHelper.commandStep(
        { command: 'Close Child Tab and Switch to Parent' },
        async () => {
            const handles = await browser.getWindowHandles();

            if (handles.length > 1) {

                const childTab = handles[handles.length - 1];
                const parentTab = handles[0];

                // switch to child
                await browser.switchToWindow(childTab);

                // close child tab
                await browser.closeWindow();

                // switch back to parent
                await browser.switchToWindow(parentTab);
            }
        }
    );
}

static async getTextByJS(xpath: string): Promise<string> {
    return ElementHelper.commandStep(
        { command: 'Get Text Using JavaScript', input: xpath },
        async () => {
            return await browser.execute((xp) => {
                const el = document.evaluate(
                    xp,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                return el ? (el.textContent ?? '').trim() : '';
            }, xpath);
        }
    );
}


static async getAttributeValue(locator: string, attribute: string): Promise<string> {
    return ElementHelper.commandStep(
        { command: 'Get Attribute Value', locator, input: attribute },
        async () => {
            try {
                const element = await $(locator);

                if (!(await element.isExisting())) {
                    return '';
                }

                return (await element.getAttribute(attribute)) ?? '';
            } catch (error) {
                console.error(`Failed to get attribute '${attribute}' for locator: ${locator}`, error);
                allure.addStep(`⚠️ Could not retrieve attribute "${attribute}"; returned empty value`, {}, Status.FAILED);
                return '';
            }
        }
    );
}

static async cmdScrollDownSmall(): Promise<void> {
    return ElementHelper.commandStep(
        { command: 'Scroll Down (Small)' },
        async () => {
            const { width, height } = await driver.getWindowRect();

            const startX = Math.floor(width / 2);
            const startY = Math.floor(height * 0.70);  // start slightly below middle
            const endY = Math.floor(height * 0.50);    // small scroll up

            await driver.performActions([
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: startX, y: startY },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pointerMove', duration: 500, x: startX, y: endY },
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);

            await driver.releaseActions();
        }
    );
}
static async cmdSwipeRight() {

  const { width, height } = await driver.getWindowRect();

  await driver.performActions([{
    type: 'pointer',
    id: 'finger1',
    parameters: { pointerType: 'touch' },
    actions: [
      { type: 'pointerMove', duration: 0, x: width * 0.8, y: height * 0.5 },
      { type: 'pointerDown', button: 0 },
      { type: 'pointerMove', duration: 600, x: width * 0.2, y: height * 0.5 },
      { type: 'pointerUp', button: 0 }
    ]
  }]);
}
static async cmdScrubSeekBar(locator: string, percentage: number = 0.6) {
 
  const element = await $(locator)
 
  await element.waitForDisplayed({ timeout: 10000 })
 
  const location = await element.getLocation()
  const size = await element.getSize()
 
  const startX = location.x + 5
  const endX = location.x + size.width * percentage
  const y = location.y + size.height / 2
 
  await browser.action('pointer')
    .move({ x: startX, y })
    .down()
    .move({ x: endX, y })
    .up()
    .perform()
 
}

 static async cmdGetAttribute(locator: string, attributeName: string): Promise<string> {
    const element = await $(locator)
    await element.waitForDisplayed()
 
    return ElementHelper.commandStep(
        { command: 'Get Attribute', locator },
        async () => {
            const value = await element.getAttribute(attributeName)
            return (value ?? '').trim()
        }
    )
}
 

}

// Provide a named export for existing imports that use `import { ElementHelper }`
export { ElementHelper }
























































































// import allure from '@wdio/allure-reporter'

// interface CommandMeta {
//     command: string
//     locator?: string
//     input?: string
//     screenshotAfter?: boolean
// }

// export default class ElementHelper {

//     private static readonly DEFAULT_TIMEOUT = 10000

//     private static isNativeApp(): boolean {
//         return Boolean((driver as WebdriverIO.Browser).isAndroid || (driver as WebdriverIO.Browser).isIOS)
//     }

//     // ==========================================
//     // Central Command Wrapper (CORE ENGINE)
//     // ==========================================
//     private static async commandStep(
//         meta: CommandMeta,
//         action: () => Promise<any>
//     ): Promise<any> {

//         try {
//             allure.addStep(`${meta.command} - ${meta.locator || ''}`)

//             if (meta.input) {
//                 allure.addStep(`Input: ${meta.input}`)
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
//             allure.addStep(`❌ Failed: ${meta.command}`)
//             throw error
//         }
//     }

//     // ==========================================
//     // CLICK METHODS
//     // ==========================================

//     // static async cmdClick(
//     //     locator: string,
//     //     screenshotAfter = false,
//     //     timeout: number = ElementHelper.DEFAULT_TIMEOUT
//     // ): Promise<void> {

//     //     const element = await $(locator)

//     //     if (ElementHelper.isNativeApp()) {
//     //         await element.waitForDisplayed({ timeout })
//     //         await element.waitForEnabled({ timeout })
//     //     } else {
//     //         await element.waitForClickable({ timeout })
//     //     }

//     //     return ElementHelper.commandStep(
//     //         { command: 'Click', locator, screenshotAfter },
//     //         async () => element.click()
//     //     )
//     // }

//     static async cmdClick(
//         locator: string,
//         screenshotAfter = false,
//         timeout: number = ElementHelper.DEFAULT_TIMEOUT
//     ): Promise<void> {
//         const element = await $(locator);
//         // Platform-specific click logic
//         const platform = require('../enum/Platform').PlatformHelper.getCurrentPlatform();
//         if (platform === require('../enum/Platform').Platform.WEB) {
//             await element.waitForClickable({ timeout });
//         } else if (platform === require('../enum/Platform').Platform.ANDROID) {
//             await element.waitForDisplayed({ timeout });
//         } else {
//             await element.waitForDisplayed({ timeout });
//         }
//         return ElementHelper.commandStep(
//             { command: 'Click', locator, screenshotAfter },
//             async () => element.click()
//         );
//     }
//     // =========================================================
// // MOUSE HOVER
// // =========================================================

// static async cmdMouseHover(locator: string): Promise<void> {

//     const element = await $(locator);

//     await element.waitForExist({ timeout: 10000 });

//     await element.moveTo();

// }

// static async hoverVideoCenter(): Promise<void> {
//     const video = await $('.player-video-controls');

//     const size = await video.getSize();
//     const location = await video.getLocation();

//     const centerX = location.x + Math.floor(size.width / 2);
//     const centerY = location.y + Math.floor(size.height / 2);

//     await browser.performActions([{
//         type: 'pointer',
//         id: 'mouse',
//         parameters: { pointerType: 'mouse' },
//         actions: [
//             {
//                 type: 'pointerMove',
//                 duration: 300,
//                 x: centerX,
//                 y: centerY
//             }
//         ]
//     }]);
// }

// static async cmdJsClick(locator: string): Promise<void> {

//         const element = await $(locator)
//         await element.waitForDisplayed()

//         return ElementHelper.commandStep(
//             { command: 'JS Click', locator },
//             async () => browser.execute((el) => el.click(), element)
//         )
//     }

//     static async cmdGetElementCount(locator: string): Promise<number> {
//   const elements = await $$(locator);
//   return elements.length;
// }


//     static async cmdForceClick(locator: string): Promise<void> {
//         const element = await $(locator)
//         await element.waitForExist()

//         return ElementHelper.commandStep(
//             { command: 'Force Click', locator },
//             async () => browser.execute((el: HTMLElement) => el.click(), element)
//         )
//     }

//     // ==========================================
//     // INPUT METHODS
//     // ==========================================

//     static async cmdFill(
//         locator: string,
//         value: string,
//         timeout: number = ElementHelper.DEFAULT_TIMEOUT
//     ): Promise<void> {

//         const element = await $(locator)
//         await element.waitForDisplayed({ timeout })

//         return ElementHelper.commandStep(
//             { command: 'Fill', locator, input: value },
//             async () => element.setValue(value)
//         )
//     }

//     static async cmdClear(locator: string): Promise<void> {

//         const element = await $(locator)
//         await element.waitForDisplayed()

//         return ElementHelper.commandStep(
//             { command: 'Clear', locator },
//             async () => element.clearValue()
//         )
//     }

//     static async cmdPress(locator: string, key: string): Promise<void> {

//         const element = await $(locator)
//         await element.waitForDisplayed()

//         return ElementHelper.commandStep(
//             { command: 'Press Key', locator, input: key },
//             async () => {
//                 await element.click()
//                 await browser.keys(key)
//             }
//         )
//     }

//     // ==========================================
//     // CHECKBOX / RADIO
//     // ==========================================

//     static async cmdCheck(locator: string): Promise<void> {

//         const element = await $(locator)
//         await element.waitForDisplayed()

//         return ElementHelper.commandStep(
//             { command: 'Check', locator },
//             async () => {
//                 if (!(await element.isSelected())) {
//                     await element.click()
//                 }
//             }
//         )
//     }

//     static async cmdUncheck(locator: string): Promise<void> {

//         const element = await $(locator)
//         await element.waitForDisplayed()

//         return ElementHelper.commandStep(
//             { command: 'Uncheck', locator },
//             async () => {
//                 if (await element.isSelected()) {
//                     await element.click()
//                 }
//             }
//         )
//     }

//     static async cmdIsChecked(
//         locator: string,
//         timeout: number = ElementHelper.DEFAULT_TIMEOUT
//     ): Promise<boolean> {

//         const element = await $(locator)
//         await element.waitForExist({ timeout })

//         return ElementHelper.commandStep(
//             { command: 'Check Checked Status', locator },
//             async () => element.isSelected()
//         )
//     }

//     // ==========================================
//     // DROPDOWN
//     // ==========================================

//     static async cmdSelectByText(locator: string, text: string): Promise<void> {

//         const element = await $(locator)
//         await element.waitForDisplayed()

//         return ElementHelper.commandStep(
//             { command: 'Select By Text', locator, input: text },
//             async () => element.selectByVisibleText(text)
//         )
//     }

//     static async cmdSelectByValue(locator: string, value: string): Promise<void> {

//         const element = await $(locator)
//         await element.waitForDisplayed()

//         return ElementHelper.commandStep(
//             { command: 'Select By Value', locator, input: value },
//             async () => element.selectByAttribute('value', value)
//         )
//     }

//     // =========================================================
// // HORIZONTAL DRAG TO MID
// // =========================================================

// static async dragToEnd(
//     progressBarLocator: string,
//     scrubberLocator: string
// ): Promise<void> {

//     const progressBar = await $(progressBarLocator);
//     const scrubber = await $(scrubberLocator);

//     await progressBar.waitForDisplayed({ timeout: 10000 });

//     const barLocation = await progressBar.getLocation();
//     const barSize = await progressBar.getSize();

//     // Calculate end position (near the end of the progress bar)
//     const endX = barLocation.x + barSize.width - 5;
//     const centerY = barLocation.y + (barSize.height / 2);

//     await browser.performActions([
//         {
//             type: 'pointer',
//             id: 'mouse',
//             parameters: { pointerType: 'mouse' },
//             actions: [
//                 {
//                     type: 'pointerMove',
//                     duration: 0,
//                     origin: scrubber,
//                     x: 0,
//                     y: 0
//                 },
//                 { type: 'pointerDown', button: 0 },
//                 {
//                     type: 'pointerMove',
//                     duration: 800,
//                     origin: 'viewport',
//                     x: Math.floor(endX),
//                     y: Math.floor(centerY)
//                 },
//                 { type: 'pointerUp', button: 0 }
//             ]
//         }
//     ]);

//     await browser.releaseActions();
// }

// static async dragToMid(
//     progressBarLocator: string,
//     scrubberLocator: string
// ): Promise<void> {
//     await ElementHelper.dragToEnd(progressBarLocator, scrubberLocator)
// }

// static async dragMidToStart(
//     progressBarLocator: string,
//     scrubberLocator: string
// ): Promise<void> {

//     const progressBar = await $(progressBarLocator);
//     const scrubber = await $(scrubberLocator);

//     await progressBar.waitForDisplayed({ timeout: 10000 });

//     const barLocation = await progressBar.getLocation();
//     const barSize = await progressBar.getSize();

//     // midpoint of progress bar
//     const midX = barLocation.x + (barSize.width / 2);

//     // start position
//     const startX = barLocation.x + 2;

//     const centerY = barLocation.y + (barSize.height / 2);

//     // Move scrubber to mid first
//     await browser.performActions([
//         {
//             type: 'pointer',
//             id: 'mouse',
//             parameters: { pointerType: 'mouse' },
//             actions: [

//                 {
//                     type: 'pointerMove',
//                     duration: 0,
//                     origin: 'viewport',
//                     x: Math.floor(midX),
//                     y: Math.floor(centerY)
//                 },

//                 { type: 'pointerDown', button: 0 },

//                 {
//                     type: 'pointerMove',
//                     duration: 800,
//                     origin: 'viewport',
//                     x: Math.floor(startX),
//                     y: Math.floor(centerY)
//                 },

//                 { type: 'pointerUp', button: 0 }

//             ]
//         }
//     ]);

//     await browser.releaseActions();
// }

// // =========================================================
// // HORIZONTAL DRAG FROM START TO MID
// // =========================================================

// static async dragToMidFromStart(
//     progressBarLocator: string,
//     scrubberLocator: string
// ): Promise<void> {

//     const progressBar = await $(progressBarLocator);
//     const scrubber = await $(scrubberLocator);

//     await progressBar.waitForDisplayed({ timeout: 10000 });

//     const barLocation = await progressBar.getLocation();
//     const barSize = await progressBar.getSize();

//     // Calculate mid position
//     const midX = barLocation.x + (barSize.width / 2);
//     const centerY = barLocation.y + (barSize.height / 2);

//     await browser.performActions([
//         {
//             type: 'pointer',
//             id: 'mouse',
//             parameters: { pointerType: 'mouse' },
//             actions: [
//                 {
//                     type: 'pointerMove',
//                     duration: 0,
//                     origin: scrubber,
//                     x: 0,
//                     y: 0
//                 },
//                 { type: 'pointerDown', button: 0 },
//                 {
//                     type: 'pointerMove',
//                     duration: 800,
//                     origin: 'viewport',
//                     x: Math.floor(midX),
//                     y: Math.floor(centerY)
//                 },
//                 { type: 'pointerUp', button: 0 }
//             ]
//         }
//     ]);

//     await browser.releaseActions();
// }
//     // ==========================================
//     // GET METHODS
//     // ==========================================

//     static async cmdGetText(locator: string): Promise<string> {

//         const element = await $(locator)
//         await element.waitForDisplayed()

//         return ElementHelper.commandStep(
//             { command: 'Get Text', locator },
//             async () => (await element.getText()).trim()
//         )
//     }

//     static async cmdGetValue(locator: string): Promise<string> {

//         const element = await $(locator)

//         return ElementHelper.commandStep(
//             { command: 'Get Value', locator },
//             async () => element.getValue()
//         )
//     }

//     static async cmdGetCount(locator: string): Promise<number> {

//         return ElementHelper.commandStep(
//             { command: 'Get Count', locator },
//             async () => (await $$(locator)).length
//         )
//     }

//     static async cmdGetAllTexts(locator: string): Promise<string[]> {

//         return ElementHelper.commandStep(
//             { command: 'Get All Texts', locator },
//             async () => {
//                 const elements = await $$(locator)
//                 const texts: string[] = []
//                 for (const el of elements) {
//                     texts.push((await el.getText()).trim())
//                 }
//                 return texts
//             }
//         )
//     }

//     // ==========================================
//     // VISIBILITY
//     // ==========================================

//     static async cmdIsVisible(locator: string): Promise<boolean> {

//         return ElementHelper.commandStep(
//             { command: 'Is Visible', locator },
//             async () => {
//                 try {
//                     const element = await $(locator)
//                     return await element.isDisplayed()
//                 } catch {
//                     return false
//                 }
//             }
//         )
//     }

//     // ==========================================
//     // HOVER / SCROLL
//     // ==========================================

//     static async cmdHover(locator: string): Promise<void> {

//         const element = await $(locator)
//         await element.waitForDisplayed()

//         return ElementHelper.commandStep(
//             { command: 'Hover', locator },
//             async () => element.moveTo()
//         )
//     }

//     static async cmdScrollIntoView(locator: string): Promise<void> {

//         const element = await $(locator)

//         return ElementHelper.commandStep(
//             { command: 'Scroll Into View', locator },
//             async () => element.scrollIntoView()
//         )
//     }

//     // ==========================================
//     // FILE UPLOAD
//     // ==========================================

//     static async cmdUploadFile(locator: string, filePath: string): Promise<void> {

//         return ElementHelper.commandStep(
//             { command: 'Upload File', locator, input: filePath },
//             async () => {
//                 const remotePath = await browser.uploadFile(filePath)
//                 const input = await $(locator)
//                 await input.setValue(remotePath)
//             }
//         )
//     }

//     // ==========================================
//     // WINDOW / TAB
//     // ==========================================



//     static async cmdSwitchToWindow(index: number): Promise<void> {

//         return ElementHelper.commandStep(
//             { command: 'Switch Window', input: index.toString() },
//             async () => {
//                 const handles = await browser.getWindowHandles()
//                 await browser.switchToWindow(handles[index])
//             }
//         )
//     }

//     static async cmdCloseCurrentTab(): Promise<void> {

//         return ElementHelper.commandStep(
//             { command: 'Close Current Tab' },
//             async () => browser.closeWindow()
//         )
//     }

//     // ==========================================
//     // KEYBOARD
//     // ==========================================

//     static async cmdKeyboardType(text: string): Promise<void> {

//         return ElementHelper.commandStep(
//             { command: 'Keyboard Type', input: text },
//             async () => browser.keys(text)
//         )
//     }

//     static async cmdKeyboardShortcut(keys: string[]): Promise<void> {

//         return ElementHelper.commandStep(
//             { command: 'Keyboard Shortcut', input: keys.join('+') },
//             async () => browser.keys(keys)
//         )
//     }

//     // ==========================================
//     // PAUSE
//     // ==========================================

//     static async cmdPause(milliseconds: number): Promise<void> {

//         return ElementHelper.commandStep(
//             { command: 'Pause', input: milliseconds.toString() },
//             async () => browser.pause(milliseconds)
//         )
//     }

//     // ---------------------------
//     // Backwards-compatible aliases
//     // ---------------------------

//     static async isElementPresent(selector: string): Promise<boolean> {
//         try {
//             const count = await ElementHelper.cmdGetCount(selector)
//             return (count ?? 0) > 0
//         } catch {
//             return false
//         }
//     }

//     static async isElementVisible(selector: string): Promise<boolean> {
//         return ElementHelper.cmdIsVisible(selector)
//     }

//     static async isElementEnabled(selector: string): Promise<boolean> {
//         try {
//             const el = await $(selector)
//             return await el.isEnabled()
//         } catch {
//             return false
//         }
//     }

//     static async safeClick(selector: string, retries: number = 3, timeout: number = 5000): Promise<void> {
//         for (let i = 0; i < retries; i++) {
//             try {
//                 await ElementHelper.cmdClick(selector, false, timeout)
//                 return
//             } catch (e) {
//                 if (i === retries - 1) throw e
//                 await browser.pause(300)
//             }
//         }
//     }

//     static async safeType(selector: string, text: string, clearFirst: boolean = true): Promise<void> {
//         if (clearFirst) await ElementHelper.cmdClear(selector)
//         await ElementHelper.cmdFill(selector, text)
//     }

//     static async getTextWithRetry(selector: string, retries: number = 3): Promise<string> {
//         for (let i = 0; i < retries; i++) {
//             try {
//                 return await ElementHelper.cmdGetText(selector)
//             } catch (e) {
//                 if (i === retries - 1) throw e
//                 await browser.pause(250)
//             }
//         }
//         return ''
//     }

//     static async waitUntilTextChanges(locator: string, oldText: string, timeout = 15000) {

//   await browser.waitUntil(
//     async () => {
//       const newText = await this.cmdGetText(locator);
//       return newText.trim() !== oldText.trim();
//     },
//     {
//       timeout,
//       interval: 500,
//       timeoutMsg: `Text did not change from "${oldText}"`
//     }
//   );

// }

//     static async setCheckbox(selector: string, checked: boolean): Promise<void> {
//         if (checked) await ElementHelper.cmdCheck(selector)
//         else await ElementHelper.cmdUncheck(selector)
//     }

//     // Backwards-compatible aliases for old method names
//     static async selectByText(selector: string, text: string): Promise<void> {
//         return ElementHelper.cmdSelectByText(selector, text)
//     }

//     static async uploadFile(selector: string, filePath: string): Promise<void> {
//         return ElementHelper.cmdUploadFile(selector, filePath)
//     }
// static async waitForLoader(loaderLocator: string): Promise<void> {
//     const loader = await $(loaderLocator);

//     if (await loader.isDisplayed().catch(() => false)) {
//         await loader.waitForDisplayed({ reverse: true, timeout: 20000 });
//     }
// }

// // =========================================================
// // SWITCH TO NEW TAB AND OPEN URL
// // =========================================================

// static async switchToNewTabAndLaunchUrl(url: string): Promise<void> {

//     const parent = await browser.getWindowHandle();

//     // open blank tab
//     await browser.execute(() => window.open());

//     const handles = await browser.getWindowHandles();

//     const newTab = handles.find(h => h !== parent);

//     if (newTab) {
//         await browser.switchToWindow(newTab);
//         await browser.url(url);
//     }

// }
// // =========================================================
// // GET COPIED TEXT FROM CLIPBOARD
// // =========================================================

// static async getCopiedText(): Promise<string> {

//     await browser.execute(() => {
//         const input = document.createElement('input');
//         input.id = 'tempClipboardInput';
//         document.body.appendChild(input);
//         input.focus();
//     });

//     const input = await $('#tempClipboardInput');

//     await browser.keys(['Control', 'v']);

//     const value = await input.getValue();

//     await browser.execute(() => {
//         const el = document.getElementById('tempClipboardInput');
//         if (el) el.remove();
//     });

//     return value;
// }

// static async switchBackToParentAndCloseChild(): Promise<void> {

//     const handles = await browser.getWindowHandles();

//     if (handles.length > 1) {

//         const childTab = handles[handles.length - 1];
//         const parentTab = handles[0];

//         // switch to child
//         await browser.switchToWindow(childTab);

//         // close child tab
//         await browser.closeWindow();

//         // switch back to parent
//         await browser.switchToWindow(parentTab);
//     }
// }

// static async getTextByJS(xpath: string): Promise<string> {
//     return await browser.execute((xp) => {
//         const el = document.evaluate(
//             xp,
//             document,
//             null,
//             XPathResult.FIRST_ORDERED_NODE_TYPE,
//             null
//         ).singleNodeValue;

//         return el ? (el.textContent ?? '').trim() : '';
//     }, xpath);
// }


// static async cmdScrollDownSmall(): Promise<void> {

//   const { width, height } = await driver.getWindowRect();

//   const startX = Math.floor(width / 2);
//   const startY = Math.floor(height * 0.70);  // start slightly below middle
//   const endY = Math.floor(height * 0.50);    // small scroll up

//   await driver.performActions([
//     {
//       type: 'pointer',
//       id: 'finger1',
//       parameters: { pointerType: 'touch' },
//       actions: [
//         { type: 'pointerMove', duration: 0, x: startX, y: startY },
//         { type: 'pointerDown', button: 0 },
//         { type: 'pointerMove', duration: 500, x: startX, y: endY },
//         { type: 'pointerUp', button: 0 }
//       ]
//     }
//   ]);

//   await driver.releaseActions();
// }


// static async cmdSwipeRight() {

//   const { width, height } = await driver.getWindowRect();

//   await driver.performActions([{
//     type: 'pointer',
//     id: 'finger1',
//     parameters: { pointerType: 'touch' },
//     actions: [
//       { type: 'pointerMove', duration: 0, x: width * 0.8, y: height * 0.5 },
//       { type: 'pointerDown', button: 0 },
//       { type: 'pointerMove', duration: 600, x: width * 0.2, y: height * 0.5 },
//       { type: 'pointerUp', button: 0 }
//     ]
//   }]);
// }

// static async getAttributeValue(locator: string, attribute: string): Promise<string> {
//     try {
//         const element = await $(locator);

//         if (!(await element.isExisting())) {
//             return '';
//         }

//         return (await element.getAttribute(attribute)) ?? '';
//     } catch (error) {
//         console.log(`Failed to get attribute '${attribute}' for locator: ${locator}`);
//         return '';
//     }
// }

// static async cmdScrubSeekBar(locator: string, percentage: number = 0.6) {
 
//   const element = await $(locator)
 
//   await element.waitForDisplayed({ timeout: 10000 })
 
//   const location = await element.getLocation()
//   const size = await element.getSize()
 
//   const startX = location.x + 5
//   const endX = location.x + size.width * percentage
//   const y = location.y + size.height / 2
 
//   await browser.action('pointer')
//     .move({ x: startX, y })
//     .down()
//     .move({ x: endX, y })
//     .up()
//     .perform()
 
// }

//  static async cmdGetAttribute(locator: string, attributeName: string): Promise<string> {
//     const element = await $(locator)
//     await element.waitForDisplayed()
 
//     return ElementHelper.commandStep(
//         { command: 'Get Attribute', locator },
//         async () => {
//             const value = await element.getAttribute(attributeName)
//             return (value ?? '').trim()
//         }
//     )
// }
 

 

// }

// // Provide a named export for existing imports that use `import { ElementHelper }`
// export { ElementHelper }

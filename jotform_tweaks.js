// ==UserScript==
// @name         Jotform Tweaks
// @version      0.104
// @description  Create tweaks to the jotform admin interface.
// @author       Gabriel Calderon with GPT
// @match        https://www.jotform.com/build/*
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/lmsanational/JotformTweaks/main/jotform_tweaks.js
// ==/UserScript==



console.log("Jotform Tweaks script started");

function applyStylesForConditionsPage() {
    console.log("applyStylesForConditionsPage called");
    GM_addStyle('.modules { max-width: 100% !important; }');
    GM_addStyle(`
        .moodular .text-truncate,
        .text-truncate {
            overflow: visible !important;
            text-overflow: clip !important;
            white-space: normal !important;
        }
    `);

    waitForElementsOnConditionsPage();
}

function waitForElementsOnConditionsPage() {
    console.log("waitForElementsOnConditionsPage called");

    // Check if the conditionElements already exist
    const conditionElements = document.querySelectorAll('.modules, .moodular .text-truncate, .text-truncate');

    if (conditionElements.length > 0) {
        // Elements already exist, apply styles and set up mutation observer
        console.log(`Found ${conditionElements.length} condition elements`);
        conditionElements.forEach(el => {
            if (el.classList.contains('text-truncate')) {
                el.style.width = '100%';
            }
        });
        console.log("Styles applied for condition elements");

        // Now that elements are found, set up a mutation observer
        setupMutationObserver();
    } else {
        // Elements don't exist, set up a mutation observer to wait for them
        const observer = new MutationObserver((mutations, obs) => {
            console.log("Mutation observer triggered for conditions page");
            const conditionElements = document.querySelectorAll('.modules, .moodular .text-truncate, .text-truncate');
            console.log(`Found ${conditionElements.length} condition elements`);

            if (conditionElements.length > 0) {
                conditionElements.forEach(el => {
                    if (el.classList.contains('text-truncate')) {
                        el.style.width = '100%';
                    }
                });
                console.log("Styles applied for condition elements");

                // Now that elements are found, set up a mutation observer
                setupMutationObserver();

                // Now that elements are found, disconnect the observer
                obs.disconnect();
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }
}

function setupMutationObserver() {
    console.log("Setting up mutation observer for conditions page");

    const observerCallback = (mutations, obs) => {
        // Check the URL to determine if it's still the conditions page
        if (!isConditionsPageURL()) {
            console.log("URL is no longer the conditions page, disconnecting observer.");
            obs.disconnect(); // Disconnect the observer if the URL is not the conditions page
            return;
        }

        console.log("Observer callback triggered"); // Add this log statement

        // Handle mutations here if needed
        const conditionElements = document.querySelectorAll('.modules, .moodular .text-truncate, .text-truncate');

        conditionElements.forEach(el => {
            if (el.classList.contains('text-truncate')) {
                el.style.width = '100%';
                console.log("Style applied for condition element"); // Add this log statement
            }
        });
    };

    const observer = new MutationObserver(observerCallback);

    // Check if the URL is the conditions page before observing mutations
    if (isConditionsPageURL()) {
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }
}


// Helper function to check if the URL is the conditions page URL
function isConditionsPageURL() {
    const urlPatternConditionsPage = /^https:\/\/www\.jotform\.com\/build\/\d+\/settings\/conditions(\/.*)?$/;
    return urlPatternConditionsPage.test(window.location.href);
}


function highlightFormLinesWithCondition() {
    console.log("highlightFormLinesWithCondition called");
    const formLines = document.querySelectorAll('li[class*="form-line"]');

    formLines.forEach((line, index) => {
        const fiberKey = Object.keys(line).find(key => key.startsWith('__reactFiber$'));
        if (fiberKey) {
            let fiber = line[fiberKey];

            while (fiber) {
                if (fiber.stateNode && (typeof fiber.stateNode.render === 'function' || typeof fiber.stateNode === 'function')) {
                    const props = fiber.memoizedProps;
                    if (props && props.isThereCondition && props.isThereCondition === true) {
                        line.style.backgroundImage = 'linear-gradient(to right, rgba(255, 255, 224, 0.7), rgba(255, 204, 203, 0.7))';
                        console.log(`Styling applied to line ${index + 1}`);
                        break;
                    }
                }
                fiber = fiber.return;
            }
        }
    });
}

function waitForElementsOnBuilderPage() {
    console.log("waitForElementsOnBuilderPage called");
    const observer = new MutationObserver((mutations, obs) => {
        const formLines = document.querySelectorAll('li[class*="form-line"]');
        console.log(`Found ${formLines.length} form lines in waitForElementsOnBuilderPage`);
        if (formLines.length > 0) {
            highlightFormLinesWithCondition();
            obs.disconnect();
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
}

function handleURLChange(url) {
    console.log(`handleURLChange called with URL: ${url}`);
    const urlPatternFormBuilder = /^https:\/\/www\.jotform\.com\/build\/\d+\/?$/;
    const urlPatternConditionsPage = /^https:\/\/www\.jotform\.com\/build\/\d+\/settings\/conditions(\/.*)?$/;

    switch (true) {
        case urlPatternFormBuilder.test(url):
            console.log("URL matches form builder pattern");
            waitForElementsOnBuilderPage();
            break;
        case urlPatternConditionsPage.test(url):
            console.log("URL matches conditions page pattern");
            applyStylesForConditionsPage();
            break;
        default:
            console.log("URL does not match any predefined patterns");
            break;
    }
}

function observeURLChanges() {
    console.log("observeURLChanges called");
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            console.log(`URL changed to: ${url}`);
            lastUrl = url;
            handleURLChange(url);
        }
    }).observe(document, { subtree: true, childList: true });
}

function init() {
    console.log("init function called");
    if (document.readyState === "loading") {
        console.log("Document is loading, setting up DOMContentLoaded listener");
        document.addEventListener('DOMContentLoaded', () => {
            console.log("DOMContentLoaded event fired");
            observeURLChanges();
            handleURLChange(window.location.href);
        });
    } else {
        console.log("Document already loaded");
        observeURLChanges();
        handleURLChange(window.location.href);
    }
}

init();






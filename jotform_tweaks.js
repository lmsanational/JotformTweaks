// ==UserScript==
// @name         Jotform Tweaks
// @version      0.1
// @description  Create tweaks to the jotform admin interface.
// @author       Gabriel Calderon with GPT
// @match        https://www.jotform.com/build/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/lmsanational/JotformTweaks/main/jotform_tweaks.js
// ==/UserScript==

function highlightFormLinesWithCondition() {
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

function waitForElements() {
    const observer = new MutationObserver((mutations, obs) => {
        const formLines = document.querySelectorAll('li[class*="form-line"]');
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

if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', waitForElements);
} else {
    waitForElements();
}

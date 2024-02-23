/**
 * Uses querySelector to select an element and will throw an error if nothing matches the selection or if it's not the expected type
 * @param {string} selector - The CSS selector of the element you want to select (e.g., ".class", "#id", "tag")
 * @param {string} expectedTagName - The expected tag name of the element (e.g., "DIV", "P"). Note: Tag names are usually uppercase.
 * @returns {Element}
 * 
 * @example
 *   const myDiv = selectElement("#myDiv", "div");

 */
export function selectElement(selector, expectedTagName) {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`No element matches the selector '${selector}'.`);
  }

  if (element.tagName !== expectedTagName.toUpperCase()) {
    throw new Error(
      `The selected element is not a '${expectedTagName}' tag. It's a '${element.tagName}' tag.`
    );
  }

  return element;
}

/**
 * Creates an array containing numbers from 1 up to and including the chosen number.
 * This function generates a sequence of numbers starting from 1, adding each number
 * to an array until it reaches the specified maximum number.
 *
 * @param {number} maxNumber The chosen number up to which the array should be filled.
 * @returns {number[]} An array of numbers from 1 to maxNumber, inclusive.
 *
 * @example
 * const chosenNumber = 10;
 * const numberArray = createArrayUpToNumber(chosenNumber);
 * // numberArray will be [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 */
export function createArrayUpToNumber(maxNumber) {
  const array = []; // Initialize an empty array to hold the numbers.

  // Loop from 1 to maxNumber, inclusive.
  for (let i = 1; i <= maxNumber; i++) {
    array.push(i); // Add the current number to the array.
  }

  return array; // Return the populated array.
}

/**
 * Creates a new HTML Element. If you want to add attributes other than classes to it, you will have to do it manually.
 * @param el {string} - The element to create
 * @param textContent {string} - The text content to add to the element
 * @param classNames {string | undefined} - The classes to add to the element
 * @returns {Element}
 */
export function createElement(el, textContent = '', classNames = undefined) {
  const element = document.createElement(el);
  element.textContent = textContent;

  if (classNames !== undefined) element.classList.add(classNames);

  return element;
}

/**
 * Appends an element to the desired location. Defaults to the document body
 * @param child {Element} - The child element to append
 * @param parent {Element} - The parent element to append to
 */
export function appendElement(child, parent = document.body) {
  parent.append(child);
}

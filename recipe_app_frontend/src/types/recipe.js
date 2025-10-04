//
// Core Recipe type definition using JSDoc for IDE intellisense and documentation
//

/**
 * PUBLIC_INTERFACE
 * @typedef {Object} Recipe
 * @property {string} id - Unique identifier (uuid or slug)
 * @property {string} title - Human-friendly recipe title
 * @property {string} description - Short description of the recipe
 * @property {string[]} ingredients - List of ingredients (each entry is a line)
 * @property {Array<{ step: number, text: string }>} instructions - Ordered steps
 * @property {number} prepTime - Preparation time in minutes
 * @property {number} cookTime - Cooking time in minutes
 * @property {number} servings - Number of servings this recipe yields
 * @property {string} cuisine - Cuisine name (e.g., "Italian", "Mexican")
 * @property {string[]} tags - List of tags (e.g., "vegetarian", "quick", "gluten-free")
 * @property {string} image - Image url for list/detail display (placeholder URLs allowed)
 * @property {number} [rating] - Optional rating from 0 to 5
 */

export default {};

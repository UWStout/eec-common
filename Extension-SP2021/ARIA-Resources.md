## Official Standards
- [Web Content Accessability Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [ARIA in HTML (w3.org)](https://www.w3.org/TR/html-aria/#docconformance-attr)

## General ARIA articles
- [How to Use ARIA Roles, Properties, and States in HTML (tutsplus.com)](https://webdesign.tutsplus.com/tutorials/aria-roles-properties-and-states-in-html--cms-36097)
- [Google Introduction to ARIA](https://developers.google.com/web/fundamentals/accessibility/semantics-aria/)
- [Mozilla ARIA Techniques](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)

## ARIA Tools
- [ARIA DevTools - Chrome Web Store (google.com)](https://chrome.google.com/webstore/detail/aria-devtools/dneemiigcbbgbdjlcdjjnianlikimpck)
- 

## As Related to Testing
- [ByRole | Testing Library (testing-library.com)](https://testing-library.com/docs/queries/byrole/)
- [Don't use GetByTestID](https://dev.to/jacques_blom/don-t-use-getbytestid-32oj)

## ARIA Attributes of Interest
- role: A promise that this object fulfills a certain role different from the base tag.
- aria-label: An alternative string label that is accessible by assistive devices only (just the essence).
- aria-labelledby: The ID of a visible element that labels this element (just the essence).
- aria-describedby: The IDs of the elements that describe the object (more detailed than a label).

## Landmark Structures
Root structure of the page, probably not relevant to our extension as we don't want to break what's already there in the messaging tool.

- Banner
- Complementary
- Contentinfo
- Form
- Main
- Navigation
- Region
- Search

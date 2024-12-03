"use client";

import clsx from "clsx";
import React from "react";

/**
 * A reusable component that replaces placeholders in a template string with highlighted values.
 * @param {string} template - The template string with placeholders in the format {{key}}.
 * @param {Record<string, string>} params - An object mapping keys to values which replace the placeholders.
 * @param {string} className - Optional className for overriding default highlight styles.
 */
const ReplaceWithHighlight = ({
  template,
  params,
  className,
  classNameHighlight,
}: {
  template: string;
  params: Record<string, string>;
  className?: string;
  classNameHighlight?: string;
}) => {
  // Function to replace placeholders with highlighted elements and return an array of elements
  const replaceAndHighlight = (
    template: string,
    params: Record<string, string>,
  ): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = []; // Array to hold text and JSX elements
    const regex = /{{(.*?)}}/g;
    let lastIndex = 0; // Track the last index after the last match

    let match;
    while ((match = regex.exec(template)) !== null) {
      const index = match.index;
      const key = match[1].trim();
      const value = params[key];

      // Push preceding text if any
      if (index > lastIndex) {
        parts.push(template.substring(lastIndex, index));
      }

      // Push the highlighted element or the unchanged placeholder
      if (value) {
        parts.push(
          <span
            className={clsx("font-medium text-contrast", classNameHighlight)}
            key={key}
          >
            {value}
          </span>,
        );
      } else {
        parts.push(`{{${key}}}`);
      }

      // Update lastIndex to the end of the current match
      lastIndex = index + match[0].length;
    }

    // Add any remaining text after the last match
    if (lastIndex < template.length) {
      parts.push(template.substring(lastIndex));
    }

    return parts;
  };

  // Render the template with highlighted replacements
  return (
    <div className={className}>{replaceAndHighlight(template, params)}</div>
  );
};
ReplaceWithHighlight.displayName = "ReplaceWithHighlight";

export { ReplaceWithHighlight };

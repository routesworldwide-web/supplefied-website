import React from "react";

const renderInlineText = (text = "") => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const BlogContentBlocks = ({ blocks = [] }) => {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const HeadingTag = `h${block.level || 2}`;
          return (
            <HeadingTag key={index} className="tp-postbox-details-heading">
              {renderInlineText(block.text)}
            </HeadingTag>
          );
        }

        if (block.type === "quote") {
          return (
            <div key={index} className="tp-postbox-details-quote tp-blog-managed-quote">
              <blockquote>
                <p>{renderInlineText(block.text)}</p>
              </blockquote>
            </div>
          );
        }

        if (block.type === "list") {
          return (
            <div key={index} className="tp-postbox-details-list">
              <ul>
                {(block.items || []).map((item, itemIndex) => (
                  <li key={itemIndex}>{renderInlineText(item)}</li>
                ))}
              </ul>
            </div>
          );
        }

        return <p key={index}>{renderInlineText(block.text)}</p>;
      })}
    </>
  );
};

export default BlogContentBlocks;

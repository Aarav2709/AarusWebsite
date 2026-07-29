function getText(node) {
  if (node.type === "text") {
    return node.value;
  }

  if (!Array.isArray(node.children)) {
    return "";
  }

  return node.children.map(getText).join("");
}

function addClass(node, className) {
  const current = node.properties?.className ?? [];
  const classes = Array.isArray(current) ? current : [current];

  node.properties = {
    ...node.properties,
    className: [...classes, className],
  };
}

function enhanceCodeBlock(node) {
  const code = node.children?.find((child) => child.type === "element" && child.tagName === "code");

  if (code?.properties?.["data-language"] !== "diff") {
    return;
  }

  for (const line of code.children ?? []) {
    if (line.type !== "element" || !("data-line" in (line.properties ?? {}))) {
      continue;
    }

    const text = getText(line).trimStart();

    if (text.startsWith("+") && !text.startsWith("+++")) {
      addClass(line, "blogDiffAddition");
    }

    if (text.startsWith("-") && !text.startsWith("---")) {
      addClass(line, "blogDiffDeletion");
    }
  }
}

function enhanceChildren(node) {
  if (!Array.isArray(node.children)) {
    return;
  }

  node.children = node.children.map((child) => {
    enhanceChildren(child);

    if (child.type === "element" && child.tagName === "pre") {
      enhanceCodeBlock(child);
    }

    if (
      child.type === "element" &&
      child.tagName === "p" &&
      child.children?.length === 1 &&
      child.children[0]?.type === "element" &&
      child.children[0]?.tagName === "img"
    ) {
      const image = child.children[0];
      const caption = image.properties?.title;

      if (typeof caption !== "string" || caption.length === 0) {
        return child;
      }

      return {
        type: "element",
        tagName: "figure",
        properties: {
          className: ["blogFigure"],
        },
        children: [
          image,
          {
            type: "element",
            tagName: "figcaption",
            properties: {},
            children: [
              {
                type: "text",
                value: caption,
              },
            ],
          },
        ],
      };
    }

    return child;
  });
}

export default function rehypeBlogFeatures() {
  return (tree) => {
    enhanceChildren(tree);
  };
}

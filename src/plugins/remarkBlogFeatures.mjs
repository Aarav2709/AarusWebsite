const calloutLabels = {
  danger: "Important",
  info: "Note",
  note: "Note",
  tip: "Tip",
  warning: "Warning",
};

function visit(node) {
  if (node.type === "code") {
    const meta = node.meta ?? "";

    if (!/\bshowLineNumbers(?:\{\d+\})?\b/.test(meta)) {
      node.meta = `${meta} showLineNumbers`.trim();
    }
  }

  if (node.type === "textDirective" && node.name === "kbd") {
    node.data = {
      ...node.data,
      hName: "kbd",
    };
  }

  if (node.type === "containerDirective" && node.name in calloutLabels) {
    const kind = node.name;

    node.data = {
      ...node.data,
      hName: "aside",
      hProperties: {
        className: ["blogCallout", `blogCallout${kind}`],
        "data-callout": kind,
      },
    };

    node.children.unshift({
      type: "paragraph",
      data: {
        hName: "p",
        hProperties: {
          className: ["blogCalloutTitle"],
        },
      },
      children: [
        {
          type: "text",
          value: calloutLabels[kind],
        },
      ],
    });
  }

  if (Array.isArray(node.children)) {
    node.children.forEach(visit);
  }
}

export default function remarkBlogFeatures() {
  return (tree) => {
    visit(tree);
  };
}

import {
  SelectRenderable,
  SelectRenderableEvents,
  createCliRenderer,
} from "@opentui/core";

const renderer = await createCliRenderer();

const menu = new SelectRenderable(renderer, {
  id: "menu",
  width: 30,
  height: 8,
  options: [
    { name: "New File", description: "Create a new file" },
    { name: "Open File", description: "Open an existing file" },
    { name: "Save", description: "Save current file" },
    { name: "Exit", description: "Exit the application" },
  ],
});

menu.on(SelectRenderableEvents.ITEM_SELECTED, (index, option) => {
  console.log("Selected:", option.name);
});

menu.focus();
renderer.root.add(menu);

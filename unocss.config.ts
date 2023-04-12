import { defineConfig } from "@unocss/vite";
import { presetUno } from "@unocss/preset-uno";
import { presetIcons } from "@unocss/preset-icons";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  transformers: [transformerVariantGroup()],
});

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tsconfigPaths from "vite-tsconfig-paths";

function getPlugins() {
  const plugins = [vue(), tsconfigPaths()];
  return plugins;
}

export default defineConfig({
  plugins: getPlugins(),
});

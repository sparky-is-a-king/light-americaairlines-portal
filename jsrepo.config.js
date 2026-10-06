import { defineConfig } from "jsrepo";

// React Bits registry (shadcn-format manifest at /r).
// Components install into the same folder as the hand-added ones.
export default defineConfig({
	registries: ["https://reactbits.dev/r"],
	paths: {
		component: 'src/components/reactbits',
		file: 'src/components/reactbits'
	},
	includeTests: false,
	includeDocs: false,
	watermark: true,
});

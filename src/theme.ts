import { extendTheme } from "@chakra-ui/react";
import "./css/theme.css";

export default extendTheme({
	fonts: {
		heading: `'Onest Bold', sans-serif`,
		body: `'Onest Regular', sans-serif`,
	},
	styles: {
		global: {
			body: {
				backgroundColor: "black",
				color: "white",
			},
		},
	},
	config: {
		initialColorMode: "dark",
		useSystemColorMode: false,
		cssVarPrefix: "silentclient",
	},
});

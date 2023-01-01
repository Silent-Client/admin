import { Box, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import React from "react";

function Main() {
	const [players, setPlayers] = React.useState<number>(0);

	React.useEffect(() => {
		const getData = async () => {
			try {
				const { data: res } = await axios.get(
					"https://players.silentclient.net/count"
				);

				setPlayers(res.count);
			} catch {}
		};

		getData();
	}, []);

	return (
		<Box>
			<Heading>Hello, admin!</Heading>
			<Text>Players online: {players}</Text>
		</Box>
	);
}

export default Main;

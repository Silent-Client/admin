import { Box, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { Title } from "react-head-meta";

function Main() {
	const [stats, setStats] = React.useState<{
		players: number;
		players_online: number;
	}>({ players: 0, players_online: 0 });

	React.useEffect(() => {
		const getData = async () => {
			try {
				const { data: res } = await axios.get(
					"https://api.silentclient.net/stats"
				);

				setStats(res.stats);
			} catch {}
		};

		getData();
	}, []);

	return (
		<Box>
			<Title title="Admin Dashboard | Silent Client" />
			<Heading>Hello, admin!</Heading>
			<Text>
				Players: {stats.players}
				<br />
				Players online: {stats.players_online}
			</Text>
		</Box>
	);
}

export default Main;

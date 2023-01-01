import { Box, Container, Stack } from "@chakra-ui/layout";
import React from "react";
import { Route, Routes } from "react-router";
import Header from "./components/header";
import { getAuth, getUser } from "./hooks/auth";
import AddCosmetics from "./pages/AddCosmetics";
import Login from "./pages/Login";
import Main from "./pages/Main";
import NotFound from "./pages/NotFound";
import UpdateLauncher from "./pages/UpdateLauncher";
import UpdateVersion from "./pages/UpdateVersion";

function App() {
	React.useEffect(() => {
		const getData = async () => {
			await getAuth();
		};

		getData();
	}, []);

	return (
		<Box id="silent_app">
			<Stack w="full" h="full" minHeight="100vh" direction="column" spacing={0}>
				{getUser() && <Header />}
				<Container
					paddingBottom={[5, 10]}
					maxW="full"
					id="silent_content"
					paddingTop={[5, 10]}
				>
					<Routes>
						<Route path="/" element={getUser() ? <Main /> : <Login />} />
						<Route
							path="/add_cosmetics"
							element={getUser() ? <AddCosmetics /> : <Login />}
						/>
						<Route
							path="/update_version"
							element={getUser() ? <UpdateVersion /> : <Login />}
						/>
						<Route
							path="/update_launcher"
							element={getUser() ? <UpdateLauncher /> : <Login />}
						/>
						<Route path="/login" element={<Login />} />

						<Route path="*" element={<NotFound />} />
					</Routes>
				</Container>
			</Stack>
		</Box>
	);
}

export default App;

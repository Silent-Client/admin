import {
	Container,
	Center,
	Heading,
	Stack,
	Text,
	Button,
} from "@chakra-ui/react";
import React from "react";
import { Title } from "react-head-meta";
import { Link as RLink } from "react-router-dom";

function NotFound() {
	return (
		<Container w="full">
			<Title title="Not Found | Silent Client" />
			<Center>
				<Stack spacing={16}>
					<Stack spacing={2}>
						<Center>
							<Heading size="4xl">404</Heading>
						</Center>
						<Center>
							<Text fontSize={["sm", "xl"]}>
								Sorry, this page could not be found.
							</Text>
						</Center>
					</Stack>
					<Center>
						<RLink to="/">
							<Button>Back to home</Button>
						</RLink>
					</Center>
				</Stack>
			</Center>
		</Container>
	);
}

export default NotFound;

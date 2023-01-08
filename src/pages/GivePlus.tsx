import {
	Center,
	Stack,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	Heading,
	Button,
	useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { Title } from "react-head-meta";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getUser } from "../hooks/auth";

export type CosmeticsType = {
	username: string;
	plus_expiration: string;
};

function GiveCosmetics() {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const toast = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CosmeticsType>();
	const navigate = useNavigate();

	const onSubmit = handleSubmit(async data => {
		setIsLoading(true);
		try {
			data.username = data.username.toLowerCase();

			const { data: res } = await axios.post(
				"https://api.silentclient.net/admin/give_plus",
				data,
				{
					headers: {
						Authorization: `Bearer ${getUser()?.accessToken}`,
					},
				}
			);

			if (res.errors) {
				for (const err of res.errors) {
					toast({
						title: "Error!",
						description: err.message,
						status: "error",
						duration: 3000,
						isClosable: true,
					});
				}
				return;
			}

			toast({
				title: "Success!",
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			navigate("/");
		} catch (err: any) {
			if (err?.response && err.response?.data && err.response.data?.errors) {
				for (const error of err.response.data.errors) {
					toast({
						title: "Error!",
						description: error.message,
						status: "error",
						duration: 3000,
						isClosable: true,
					});
				}
			}
		} finally {
			setIsLoading(false);
		}
	});

	return (
		<Center w="full" h="full">
			<Title title="Give plus | Silent Client" />

			<form onSubmit={onSubmit}>
				<Stack direction="column" spacing="10px">
					<Center>
						<Heading>Give cosmetics</Heading>
					</Center>
					<FormControl isInvalid={errors.username ? true : false}>
						<FormLabel>Username</FormLabel>
						<Input
							isDisabled={isLoading}
							type="text"
							{...register("username", { required: true })}
						/>
						{errors.username && (
							<FormErrorMessage>This field is required</FormErrorMessage>
						)}
					</FormControl>

					<FormControl isInvalid={errors.plus_expiration ? true : false}>
						<FormLabel>Plus expiration</FormLabel>
						<Input
							isDisabled={isLoading}
							type="date"
							{...register("plus_expiration", { required: true })}
						/>
						{errors.plus_expiration && (
							<FormErrorMessage>This field is required</FormErrorMessage>
						)}
					</FormControl>

					<Button w="full" type="submit" isDisabled={isLoading}>
						Give plus
					</Button>
				</Stack>
			</form>
		</Center>
	);
}

export default GiveCosmetics;

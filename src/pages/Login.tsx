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
import React from "react";
import { Title } from "react-head-meta";
import { useForm } from "react-hook-form";
import { login } from "../hooks/auth";

export type LoginType = {
	email: string;
	password: string;
};

function Login() {
	const toast = useToast();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginType>();
	const onSubmit = handleSubmit(async data => {
		setIsLoading(true);
		try {
			const res = await login(data.email, data.password);

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

			window.location.href = "/";
		} catch (error: any) {
			toast({
				title: "Error!",
				description: error?.message || `${error}`,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	});

	return (
		<Center w="full" h="full">
			<Title title="Login | Silent Client" />

			<form onSubmit={onSubmit}>
				<Stack direction="column" spacing="10px">
					<Center>
						<Heading>Login to Silent Client</Heading>
					</Center>
					<FormControl isInvalid={errors.email ? true : false}>
						<FormLabel>Email</FormLabel>
						<Input
							isDisabled={isLoading}
							type="email"
							{...register("email", { required: true })}
						/>
						{errors.email && (
							<FormErrorMessage>This field is required</FormErrorMessage>
						)}
					</FormControl>
					<FormControl isInvalid={errors.password ? true : false}>
						<FormLabel>Password</FormLabel>
						<Input
							isDisabled={isLoading}
							type="password"
							{...register("password", { required: true })}
						/>
						{errors.password && (
							<FormErrorMessage>This field is required</FormErrorMessage>
						)}
					</FormControl>
					<Button w="full" type="submit" isDisabled={isLoading}>
						Login
					</Button>
				</Stack>
			</form>
		</Center>
	);
}

export default Login;

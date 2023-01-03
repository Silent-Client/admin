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
	Select,
	Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { Title } from "react-head-meta";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { StoreItemType } from "../components/StoreItem";
import { getUser } from "../hooks/auth";

export type CosmeticsType = {
	type: string;
	username: string;
	cosmetics_id: string;
};

function GiveCosmetics() {
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const [capes, setCapes] = React.useState<StoreItemType[] | null>(null);
	const [wings, setWings] = React.useState<StoreItemType[] | null>(null);
	const [icons, setIcons] = React.useState<StoreItemType[] | null>(null);

	const [update, setUpdate] = React.useState<string>("");

	const toast = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
	} = useForm<CosmeticsType>();
	const navigate = useNavigate();

	const onSubmit = handleSubmit(async data => {
		setIsLoading(true);
		try {
			data.username = data.username.toLowerCase();

			const { data: res } = await axios.post(
				"https://api.silentclient.net/admin/give_cosmetic",
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

	React.useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			try {
				const { data: capes } = await axios.get(
					"https://api.silentclient.net/admin/capes"
				);

				setCapes(capes.capes);

				const { data: wings } = await axios.get(
					"https://api.silentclient.net/admin/wings"
				);

				setWings(wings.wings);

				const { data: icons } = await axios.get(
					"https://api.silentclient.net/admin/icons"
				);

				setIcons(icons.icons);
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
		};

		getData();
		// eslint-disable-next-line
	}, []);

	return isLoading ? (
		<Center>
			<Spinner size="xl" />
		</Center>
	) : (
		<Center w="full" h="full">
			<Title title="Give cosmetics | Silent Client" />

			<form onSubmit={onSubmit}>
				<Stack direction="column" spacing="10px">
					<Center>
						<Heading>Give cosmetics</Heading>
					</Center>
					<FormControl
						onBlur={() => {
							setValue("cosmetics_id", "");
							setUpdate(update === "f2" ? "f1" : "f2");
						}}
						isInvalid={errors.type ? true : false}
					>
						<FormLabel>Type</FormLabel>
						<Select
							isDisabled={isLoading}
							placeholder="Select type"
							{...register("type", { required: true })}
						>
							<option value="capes">Capes</option>
							<option value="wings">Wings</option>
							<option value="icons">Icons</option>
						</Select>

						{errors.type && (
							<FormErrorMessage>This field is required</FormErrorMessage>
						)}
					</FormControl>

					<FormControl
						onBlur={() => {
							setUpdate(update === "f2" ? "f1" : "f2");
						}}
						isInvalid={errors.username ? true : false}
					>
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

					<FormControl isInvalid={errors.cosmetics_id ? true : false}>
						<FormLabel>Item</FormLabel>
						<Select
							isDisabled={isLoading}
							placeholder="Select item"
							{...register("cosmetics_id", { required: true })}
						>
							{(getValues("type") === "capes" && (
								<>
									{capes?.map(cape => (
										<option className={update} value={cape.id}>
											{cape.name}
										</option>
									))}
								</>
							)) ||
								(getValues("type") === "wings" && (
									<>
										{wings?.map(wing => (
											<option className={update} value={wing.id}>
												{wing.name}
											</option>
										))}
									</>
								)) ||
								(getValues("type") === "icons" && (
									<>
										{icons?.map(icon => (
											<option className={update} value={icon.id}>
												{icon.name}
											</option>
										))}
									</>
								))}
						</Select>

						{errors.cosmetics_id && (
							<FormErrorMessage>This field is required</FormErrorMessage>
						)}
					</FormControl>

					<Button w="full" type="submit" isDisabled={isLoading}>
						Give cosmetics
					</Button>
				</Stack>
			</form>
		</Center>
	);
}

export default GiveCosmetics;

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
	Box,
	SimpleGrid,
	Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { Title } from "react-head-meta";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getUser } from "../hooks/auth";
import FilePicker from "chakra-ui-file-picker";
import StoreItem from "../components/StoreItem";

export type CosmeticsType = {
	texture: File;
	preview: File;
	name: string;
	type: "capes" | "wings" | "icons";
	category: string;
	price: number;
	update?: string;
};

function AddCosmetics() {
	const toast = useToast();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const [preview, setPreview] = React.useState<string | null>(null);
	const [texture, setTexture] = React.useState<string | null>(null);

	const [update, setUpdate] = React.useState<string>("");

	const [isPrivate, setIsPrivete] = React.useState<boolean>(false);

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
			const formData = new FormData();
			formData.append("texture", data.texture);
			formData.append("preview", data.preview);
			formData.append("type", data.type);
			formData.append("name", data.name);
			formData.append("price", data.price.toString());
			formData.append("normal_price", data.price.toString());
			formData.append("sale_price", data.price.toString());
			formData.append("category", data.category);
			formData.append("is_private", isPrivate ? "1" : "0");

			const { data: res } = await axios.post(
				"https://api.silentclient.net/admin/add_cosmetics",
				formData,
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
		<Box w="full" h="full">
			<Title title="Add cosmetics | Silent Client" />

			<Stack direction={"column"} spacing={5} justifyContent="space-between">
				<Center>
					<form onSubmit={onSubmit}>
						<Stack direction="column" spacing="10px">
							<FormControl
								onBlur={() => {
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
								isInvalid={errors.name ? true : false}
							>
								<FormLabel>Name</FormLabel>
								<Input
									isDisabled={isLoading}
									type="text"
									{...register("name", { required: true })}
								/>
								{errors.name && (
									<FormErrorMessage>This field is required</FormErrorMessage>
								)}
							</FormControl>
							<FormControl
								onBlur={() => {
									setUpdate(update === "f2" ? "f1" : "f2");
								}}
								isInvalid={errors.category ? true : false}
							>
								<FormLabel>Category</FormLabel>
								<Input
									isDisabled={isLoading}
									type="text"
									{...register("category", { required: true })}
								/>
								{errors.category && (
									<FormErrorMessage>This field is required</FormErrorMessage>
								)}
							</FormControl>
							<FormControl
								onBlur={() => {
									setUpdate(update === "f2" ? "f1" : "f2");
								}}
								isInvalid={errors.texture ? true : false}
							>
								<FormLabel>Texture</FormLabel>
								<FilePicker
									onFileChange={fileList => {
										setTexture(URL.createObjectURL(fileList[0]));
										setValue("texture", fileList[0]);
									}}
									placeholder={""}
									clearButtonLabel="label"
									multipleFiles={false}
									accept="image/*"
									hideClearButton={true}
								/>
								{errors.texture && (
									<FormErrorMessage>This field is required</FormErrorMessage>
								)}
							</FormControl>
							<FormControl
								onBlur={() => {
									setUpdate(update === "f2" ? "f1" : "f2");
								}}
								isInvalid={errors.preview ? true : false}
							>
								<FormLabel>Preview</FormLabel>
								<FilePicker
									onFileChange={fileList => {
										setPreview(URL.createObjectURL(fileList[0]));
										setValue("preview", fileList[0]);
									}}
									placeholder={""}
									clearButtonLabel="label"
									multipleFiles={false}
									accept="image/*"
									hideClearButton={true}
								/>
								{errors.preview && (
									<FormErrorMessage>This field is required</FormErrorMessage>
								)}
							</FormControl>
							<FormControl
								onBlur={() => {
									setUpdate(update === "f2" ? "f1" : "f2");
								}}
								isInvalid={errors.price ? true : false}
							>
								<FormLabel>Price</FormLabel>
								<Input
									isDisabled={isLoading}
									type="number"
									{...register("price", { required: true })}
								/>
								{errors.price && (
									<FormErrorMessage>This field is required</FormErrorMessage>
								)}
							</FormControl>
							<FormControl>
								<Checkbox
									isChecked={isPrivate}
									onChange={() => {
										setIsPrivete(!isPrivate);
									}}
								>
									Is private
								</Checkbox>
							</FormControl>
							<Button w="full" type="submit" isDisabled={isLoading}>
								Add cosmetics
							</Button>
						</Stack>
					</form>
				</Center>
				<Box>
					<Center>
						<Heading size="xl">Preview</Heading>
					</Center>
					<SimpleGrid mt={5} w="full" columns={[1, 2, 3]} spacing={2}>
						<StoreItem
							data={{
								id: 1,
								texture: texture || "",
								name: getValues().name,
								category: getValues().category,
								preview: preview || "",
								price: getValues().price,
								normal_price: getValues().price,
								sale_price: getValues().price,
								created_at: update,
								updated_at: update,
							}}
							type={getValues().type || "capes"}
						/>
						<StoreItem
							data={{
								id: 1,
								texture: texture || "",
								name: getValues().name,
								category: getValues().category,
								preview: preview || "",
								price: getValues().price,
								normal_price: getValues().price,
								sale_price: getValues().price,
								created_at: update,
								updated_at: update,
							}}
							type={getValues().type || "capes"}
						/>
						<StoreItem
							data={{
								id: 1,
								texture: texture || "",
								name: getValues().name,
								category: getValues().category,
								preview: preview || "",
								price: getValues().price,
								normal_price: getValues().price,
								sale_price: getValues().price,
								created_at: update,
								updated_at: update,
							}}
							type={getValues().type || "capes"}
						/>
					</SimpleGrid>
				</Box>
			</Stack>
		</Box>
	);
}

export default AddCosmetics;

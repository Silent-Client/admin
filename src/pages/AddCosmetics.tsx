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
import { SkinViewer } from "skinview3d";
import { createGIF } from "gifshot";

export type CosmeticsType = {
	texture: File[];
	preview: Blob;
	name: string;
	type: "capes" | "wings" | "icons";
	category: string;
	price: number;
	frame_delay: number;
	update?: string;
        shoulders?: File[];
};

function AddCosmetics() {
	const toast = useToast();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const [preview, setPreview] = React.useState<string | null>(null);
	const [texture, setTexture] = React.useState<string | null>(null);

	const [update, setUpdate] = React.useState<string>("");

	const [isPrivate, setIsPrivete] = React.useState<boolean>(false);
	const [isAnimated, setIsAnimated] = React.useState<boolean>(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
	} = useForm<CosmeticsType>();
	const navigate = useNavigate();

	const generatePreview = async (fileList: Blob[]) => {
		if (fileList.length === 1) {
			const skinViewer = new SkinViewer({
				width: 685,
				height: 685,
				renderPaused: true,
				zoom: 1.5,
			});
			skinViewer.camera.rotation.x = -2.9445863039147926;
			skinViewer.camera.rotation.y = -0.24129215654046646;
			skinViewer.camera.rotation.z = -3.0939339772752144;
			skinViewer.camera.position.x = -6.712216245243998;
			skinViewer.camera.position.y = 5.338818424577546;
			skinViewer.camera.position.z = -26.748223451710654;

			try {
				await Promise.all([
					skinViewer.loadSkin(null),
					skinViewer.loadCape(URL.createObjectURL(fileList[0])),
				]);
			} catch {
				toast({
					title: "Error!",
					description: "Is not cape texture!",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
				return;
			}
			skinViewer.render();

			setPreview(skinViewer.canvas.toDataURL());
			setTexture(URL.createObjectURL(fileList[0]));

			skinViewer.dispose();
			setValue("texture", fileList as File[]);

			const blobBin = atob(skinViewer.canvas.toDataURL().split(",")[1]);
			let array = [];
			for (var i = 0; i < blobBin.length; i++) {
				array.push(blobBin.charCodeAt(i));
			}
			const file = new Blob([new Uint8Array(array)], {
				type: "image/png",
			});

			setValue("preview", file);
		} else {
			let files: string[] = [];
			const skinViewer = new SkinViewer({
				width: 685,
				height: 685,
				renderPaused: true,
				zoom: 1.5,
			});
			for (const file of fileList) {
				skinViewer.camera.rotation.x = -2.9445863039147926;
				skinViewer.camera.rotation.y = -0.24129215654046646;
				skinViewer.camera.rotation.z = -3.0939339772752144;
				skinViewer.camera.position.x = -6.712216245243998;
				skinViewer.camera.position.y = 5.338818424577546;
				skinViewer.camera.position.z = -26.748223451710654;

				try {
					await Promise.all([
						skinViewer.loadSkin(null),
						skinViewer.loadCape(URL.createObjectURL(file)),
					]);
				} catch (e) {
					toast({
						title: "Error!",
						description: `Is not cape texture! ${e}`,
						status: "error",
						duration: 3000,
						isClosable: true,
					});
					return;
				}
				await skinViewer.render();
				setPreview(
					await addBackgroundColor(
						skinViewer.canvas.toDataURL(),
						"rgb(19, 19, 19)"
					)
				);
				files.push(
					await addBackgroundColor(
						skinViewer.canvas.toDataURL(),
						"rgb(19, 19, 19)"
					)
				);
			}

			skinViewer.dispose();

			const options = {
				images: files,
				gifWidth: 685,
				gifHeight: 685,
				numWorkers: 2,
				frameDuration: 0.01,
				sampleInterval: 10,
				numFrames: files.length,
			};

			createGIF(options, (obj: any) => {
				setPreview(obj.image);
				const blobBin = atob(obj.image.split(",")[1]);
				let array = [];
				for (var i = 0; i < blobBin.length; i++) {
					array.push(blobBin.charCodeAt(i));
				}
				const file = new Blob([new Uint8Array(array)], {
					type: "image/png",
				});

				setValue("preview", file);
			});

			setValue("texture", fileList as File[]);
		}
	};

	async function addBackgroundColor(imageURI: string, backgroundColor: string) {
		var image = new Image();
		image.src = imageURI;

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		canvas.width = 685;
		canvas.height = 685;

		// Add background color
		if (!ctx) {
			return imageURI;
		}
		ctx.fillStyle = backgroundColor;
		await ctx.fillRect(0, 0, canvas.width, canvas.height);

		await ctx.drawImage(image, 0, 0);

		const url = canvas.toDataURL();

		return url;
	}

	const onSubmit = handleSubmit(async data => {
		setIsLoading(true);
		try {
			const formData = new FormData();
			for (const texture of data.texture) {
				formData.append("texture", texture);
			}
			if (!isAnimated) {
				formData.append("texture", data.texture[0]);
			}
			if (data.type === "capes") {
				formData.append("preview", data.preview);
			} else {
				formData.append("preview", data.texture[0]);
			}
			formData.append("type", data.type);
			formData.append("name", data.name);
			formData.append("price", data.price.toString());
			formData.append("normal_price", data.price.toString());
			formData.append("sale_price", data.price.toString());
			formData.append("category", data.category);
			formData.append("is_private", isPrivate ? "1" : "0");
			formData.append("is_animated", isAnimated ? "1" : "0");
			formData.append("frame_delay", data.frame_delay.toString() || "0");
                        if(data.type === "capes" && data?.shoulders) {
                            formData.append("shoulders", data.shoulders);
                        }

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
									generatePreview(getValues("texture"));
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
									onFileChange={async fileList => {
										if (getValues("type") !== "capes") {
											setTexture(URL.createObjectURL(fileList[0]));
											setValue("texture", fileList);
										} else {
											generatePreview(fileList);
										}
									}}
									placeholder={""}
									clearButtonLabel="label"
									multipleFiles={true}
									accept="image/*"
									hideClearButton={true}
								/>
								{errors.texture && (
									<FormErrorMessage>This field is required</FormErrorMessage>
								)}
							</FormControl>
							{getValues("type") !== "capes" && (
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
							) || (
                                                                <FormControl
									onBlur={() => {
										setUpdate(update === "f2" ? "f1" : "f2");
									}}
									isInvalid={errors.shoudelrs ? true : false}
								>
									<FormLabel>Preview</FormLabel>
									<FilePicker
										onFileChange={fileList => {
											setPreview(URL.createObjectURL(fileList[0]));
											setValue("shoudlers", fileList[0]);
										}}
										placeholder={""}
										clearButtonLabel="label"
										multipleFiles={false}
										accept="image/*"
										hideClearButton={true}
									/>
									{errors.shoudlers && (
										<FormErrorMessage>This field is required</FormErrorMessage>
									)}
								</FormControl>
                                                        )}
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
									isChecked={isAnimated}
									onChange={() => {
										setIsAnimated(!isAnimated);
									}}
								>
									Is animated
								</Checkbox>
							</FormControl>
							<FormControl
								onBlur={() => {
									setUpdate(update === "f2" ? "f1" : "f2");
									generatePreview(getValues("texture"));
								}}
								isInvalid={errors.frame_delay ? true : false}
							>
								<FormLabel>Frame Delay</FormLabel>
								<Input
									isDisabled={isLoading}
									type="number"
									defaultValue={"150"}
									{...register("frame_delay", { required: true })}
								/>
								{errors.frame_delay && (
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

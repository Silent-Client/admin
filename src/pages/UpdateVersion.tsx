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
	Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { Title } from "react-head-meta";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getUser } from "../hooks/auth";
import FilePicker from "chakra-ui-file-picker";

export type CosmeticsType = {
	jar: File;
	version: string;
	branch: "stable" | "experimental";
	description?: string;
};

function UpdateVersion() {
	const toast = useToast();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<CosmeticsType>();
	const navigate = useNavigate();

	const onSubmit = handleSubmit(async data => {
		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("jar", data.jar);
			formData.append("version", data.version);
			formData.append("branch", data.branch);
			formData.append("description", data?.description || "");

			const { data: res } = await axios.post(
				"https://api.silentclient.net/updates/update_version",
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
			<Title title="Update version | Silent Client" />

			<form onSubmit={onSubmit}>
				<Stack direction="column" spacing="10px">
					<Center>
						<Heading>Update version</Heading>
					</Center>
					<FormControl isInvalid={errors.branch ? true : false}>
						<FormLabel>Branch</FormLabel>
						<Select
							isDisabled={isLoading}
							placeholder="Select branch"
							{...register("branch", { required: true })}
						>
							<option value="stable">Stable</option>
							<option value="experimental">Experimental</option>
						</Select>

						{errors.branch && (
							<FormErrorMessage>This field is required</FormErrorMessage>
						)}
					</FormControl>
					<FormControl isInvalid={errors.version ? true : false}>
						<FormLabel>Version</FormLabel>
						<Input
							isDisabled={isLoading}
							type="text"
							{...register("version", { required: true })}
						/>
						{errors.version && (
							<FormErrorMessage>This field is required</FormErrorMessage>
						)}
					</FormControl>
					<FormControl isInvalid={errors.description ? true : false}>
						<FormLabel>Description</FormLabel>
						<Textarea
							isDisabled={isLoading}
							{...register("description", { required: false })}
						/>
						{errors.description && (
							<FormErrorMessage>This field is required</FormErrorMessage>
						)}
					</FormControl>
					<FormControl isInvalid={errors.jar ? true : false}>
						<FormLabel>Jar</FormLabel>
						<FilePicker
							onFileChange={fileList => {
								setValue("jar", fileList[0]);
							}}
							placeholder={""}
							clearButtonLabel="label"
							multipleFiles={false}
							hideClearButton={true}
						/>
						{errors.jar && (
							<FormErrorMessage>This field is required</FormErrorMessage>
						)}
					</FormControl>

					<Button w="full" type="submit" isDisabled={isLoading}>
						Update version
					</Button>
				</Stack>
			</form>
		</Center>
	);
}

export default UpdateVersion;

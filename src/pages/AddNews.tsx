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
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { Title } from "react-head-meta";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getUser } from "../hooks/auth";
import FilePicker from "chakra-ui-file-picker";

export type NewsType = {
  cover: File;
  title: string;
  body: string;
  tags: string;
};

function AddNews() {
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<NewsType>();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("cover", data.cover);
      formData.append("title", data.title);
      formData.append("body", data.body);
      formData.append("tags", data.tags);

      const { data: res } = await axios.post(
        "https://api.silentclient.net/admin/add_news",
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
    <Center w="full" h="full">
      <Title title="Add news | Silent Client" />

      <form onSubmit={onSubmit}>
        <Stack direction="column" spacing="10px">
          <Center>
            <Heading>Add news</Heading>
          </Center>
          <FormControl isInvalid={errors.title ? true : false}>
            <FormLabel>Title</FormLabel>
            <Input
              isDisabled={isLoading}
              type="text"
              {...register("title", { required: true })}
            />
            {errors.title && (
              <FormErrorMessage>This field is required</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={errors.tags ? true : false}>
            <FormLabel>Tags</FormLabel>
            <Textarea
              isDisabled={isLoading}
              {...register("tags", { required: false })}
            />
            {errors.tags && (
              <FormErrorMessage>This field is required</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={errors.cover ? true : false}>
            <FormLabel>Cover</FormLabel>
            <FilePicker
              onFileChange={(fileList) => {
                setValue("cover", fileList[0]);
              }}
              placeholder={""}
              clearButtonLabel="label"
              multipleFiles={false}
              hideClearButton={true}
            />
            {errors.cover && (
              <FormErrorMessage>This field is required</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={errors.body ? true : false}>
            <FormLabel>Body</FormLabel>
            <Textarea
              isDisabled={isLoading}
              {...register("body", { required: false })}
            />
            {errors.body && (
              <FormErrorMessage>This field is required</FormErrorMessage>
            )}
          </FormControl>

          <Button w="full" type="submit" isDisabled={isLoading}>
            Add news
          </Button>
        </Stack>
      </form>
    </Center>
  );
}

export default AddNews;

import { Center, Stack, Text, Button, Box } from "@chakra-ui/react";
import { getUser } from "../hooks/auth";
import { LazyLoadImage } from "react-lazy-load-image-component";

export type StoreItemType = {
	id: number;
	texture: string;
	name: string;
	price: number;
	sale_price: number;
	normal_price: number;
	category: string;
	preview: string;
	created_at: string;
	updated_at: string;
};

function StoreItem({
	data,
	type,
	pageType = "store",
	username,
}: {
	data: StoreItemType;
	type: "capes" | "wings" | "icons";
	pageType?: "account" | "store";
	username?: string;
}) {
	return (
		<Stack
			direction="column"
			overflow="hidden"
			borderRadius="lg"
			boxShadow="0 15px 9px 0 rgb(0 0 0 / 10%)"
			bgColor="#131313"
		>
			<Center w="full" h="250px" userSelect="none" padding="10px">
				{(type !== "icons" && (
					<LazyLoadImage
						width="230px"
						height="230px"
						draggable="false"
						alt={data.name}
						src={data.preview}
					/>
				)) || (
					<Stack direction="row" alignItems="center" spacing={1}>
						<LazyLoadImage
							width="29px"
							height="29px"
							style={{
								minWidth: "29px",
								maxWidth: "29px",
								minHeight: "29px",
								maxHeight: "29px",
							}}
							draggable="false"
							alt={data.name}
							src={data.texture}
						/>
						<Box bgColor="rgba(0,0,0,0.45)" padding="1px 5px">
							<Center h="full">
								<Text
									textShadow="0px 3px 0px rgba(0,0,0,0.25)"
									fontFamily={`"Minecraft",sans-serif`}
									fontWeight={100}
									fontSize="27.5px"
									color="white"
								>
									{username || getUser()?.original_username || "Steve"}
								</Text>
							</Center>
						</Box>
					</Stack>
				)}
			</Center>
			<Stack
				padding="10px"
				direction={["column", "row"]}
				spacing={["5px", "0px"]}
				justifyContent={"space-between"}
			>
				<Stack direction="column" spacing="0px">
					<Text fontSize={16} fontWeight={600} color="white">
						{data.name}
					</Text>
					{pageType === "store" && <Text fontSize={16}>{data.price}₽</Text>}
				</Stack>
				{pageType === "store" && <Button w={["full", "auto"]}>Buy</Button>}
			</Stack>
		</Stack>
	);
}

export default StoreItem;

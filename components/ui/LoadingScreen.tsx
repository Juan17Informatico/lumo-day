import { ActivityIndicator, Text, View } from "react-native";

import { colors } from "@/lib/constants/theme";

type Props = {
  message?: string;
};

export function LoadingScreen({ message = "Cargando..." }: Props) {
  return (
    <View className="flex-1 items-center justify-center bg-lumo-bg">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text className="mt-4 font-inter text-base text-lumo-subtext">{message}</Text>
    </View>
  );
}

import * as images from "@/assets/images";

export const avatars = [
  { id: "default", source: images.userIcon },
  { id: "1", source: images.avatars.avatar1 },
  { id: "2", source: images.avatars.avatar2 },
  { id: "3", source: images.avatars.avatar3 },
  { id: "4", source: images.avatars.avatar4 },
  { id: "5", source: images.avatars.avatar5 },
  { id: "6", source: images.avatars.avatar6 },
  { id: "7", source: images.avatars.avatar7 },
  { id: "8", source: images.avatars.avatar8 },
  { id: "9", source: images.avatars.avatar9 },
  { id: "10", source: images.avatars.avatar10 },
  { id: "11", source: images.avatars.avatar11 },
  { id: "12", source: images.avatars.avatar12 },
  { id: "13", source: images.avatars.avatar13 },
  { id: "14", source: images.avatars.avatar14 },
  { id: "15", source: images.avatars.avatar15 },
  { id: "16", source: images.avatars.avatar16 },
];

export const getAvatarSource = (id: string) => {
  const avatar = avatars.find((avatar) => avatar.id === id);
  return avatar ? avatar.source : avatars[0].source; // Default to first avatar if not found
};

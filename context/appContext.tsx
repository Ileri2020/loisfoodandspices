"use client";
import { UserProps } from "@/types/user";
import { VideoType } from "@/types/videoType";
import React, { createContext, useState } from "react";


interface Comment {
  id: number | string;
  contentId: string; // videoId
  userId: number | string;
  username: string;
  comment: string;
  createdAt: string | Date;
}


interface AppContextProps {
  // isDark: boolean;
  // setIsDark: (isDark: boolean) => void;
  isList: boolean;
  setIsList: (isList: boolean) => void;
  videos: VideoType[];
  setVideos: (videos: VideoType[]) => void;
  selectedVideo: VideoType | null;
  setSelectedVideo: (selVideo: VideoType) => void;
  // user: UserProps;
  // setUser: (user: UserProps) => void;
  user: UserProps;
  setUser: (user: UserProps) => void;
  isModal: boolean;
  setIsModal: (isModal: boolean) => void;
  useMock: boolean;
  setUseMock: (useMock: boolean) => void;
  comments : any ;
  setComments : (comments : any) => void;
}

export const AppContext = createContext<AppContextProps | null>(null);

export const AppContextProvider: React.FC<any> = ({ children }) => {
  // const [isDark, setIsDark] = useState(false);
  const [isList, setIsList] = useState(true);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [user, setUser] = useState<UserProps>({ username: "visitor", id: "nil", email: "nil", avatarUrl: "https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png", role: "user", department: "nil", contact: "xxxx" });
  const [isModal, setIsModal] = useState(false);
  const [useMock, setUseMock] = useState(true);
  const [comments, setComments] = useState([])

  const appContextValues: AppContextProps = {
    // isDark,
    // setIsDark,
    isList,
    setIsList,
    videos,
    setVideos,
    comments,
    setComments,
    selectedVideo,
    setSelectedVideo,
    user,
    setUser,
    isModal,
    setIsModal,
    useMock,
    setUseMock,
  };

  return (
    <AppContext.Provider value={appContextValues}>
      {children}
    </AppContext.Provider>
  );
};

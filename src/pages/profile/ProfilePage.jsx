import * as S from "./styles/profilePage";
import { Helmet } from "react-helmet";
import profiles from "@/data/profile";


export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title>Devit</title>
        <link rel="icon" href="./assets/Helmet.svg"></link>
      </Helmet>
      <S.Container>
        <S.Frame>
          <S.ProfileText>프로필</S.ProfileText>
          <S.ProfileGrid>
            <S.Profile>
              <S.ProfileInfo> {/*사진, 이름, 직무 컨테이너*/}
                <S.ImgContainer>{/*프로필 사진 컨테이너*/}
                  <S.ProfileImg src={profiles[0].img} alt="프로필 이미지" />
                  <S.CameraIcon src="/assets/camera-icon.svg" />
                </S.ImgContainer>
                <S.NameContainer> {/*이름, 직무 컨테이너*/}
                  <S.Name>{profiles[0].id}</S.Name>
                  <S.Job>{profiles[0].job}</S.Job>
                </S.NameContainer>
              </S.ProfileInfo>
              <S.EditButton>프로필 편집</S.EditButton>
              <S.PersonalInfo>
                <S.EmailInfo>
                    <S.Email>이메일</S.Email>
                    <S.PersonalEmail>{profiles[0].email}</S.PersonalEmail>
                </S.EmailInfo>
              </S.PersonalInfo>
            </S.Profile>
          </S.ProfileGrid>
        </S.Frame>
      </S.Container>
    </>
  );
}

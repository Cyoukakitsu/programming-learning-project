import { getConfig } from "../utils/configHelper";
import { supabase } from "../utils/supabase";
import { updateUser } from "./APIAuth";

const token = getConfig("SUPABASE_TOKEN");
const supabaseUrl = getConfig("SUPABASE_URL");

const userToken = JSON.parse(localStorage.getItem(token));
export async function uploadAvatar(avatarFile) {
  const avatarFilename = `${userToken.user.email}-${Date.now()}.png`;

  const { data, error } = await supabase.storage
    .from("avatar")
    .upload(`public/${avatarFilename}`, avatarFile, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.log(error.message);
    return;
  }
  // 修复URL生成方式，正确构造Supabase存储的公共URL
  const newAvatarUrl = `${supabaseUrl}/storage/v1/object/public/avatar/public/${avatarFilename}`;
  const newUserMetadata = await updateUser({ avatar: newAvatarUrl });

  return newUserMetadata;
}

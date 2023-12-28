class User {
  constructor(
    name,
    gender,
    birthDate,
    username,
    email,
    password,
    profileImage,
    roles
  ) {
    this.name = name;
    this.gender = gender;
    this.birthDate = birthDate;
    this.username = username;
    this.email = email;
    this.password = password;
    this.profileImage = profileImage;
    this.roles = roles;
  }
}

export default User;

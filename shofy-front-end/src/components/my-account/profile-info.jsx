import React, { useEffect } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as Yup from "yup";
// internal
import ErrorMsg from '../common/error-msg';
import { EmailTwo, LocationTwo, PhoneThree, UserThree } from '@/svg';
import { useUpdateProfileMutation } from '@/redux/features/auth/authApi';
import { notifyError, notifySuccess } from '@/utils/toast';

// yup  schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  contactNumber: Yup.string()
    .nullable()
    .matches(/^[0-9+\-\s()]{7,20}$|^$/, "Please enter a valid mobile number")
    .label("Mobile Number"),
  address: Yup.string().nullable().label("Address"),
  bio: Yup.string().nullable().label("Bio"),
});

const ProfileInfo = () => {
  const { user } = useSelector((state) => state.auth);

  const [updateProfile, {}] = useUpdateProfileMutation();
  // react hook form
  const {register,handleSubmit,formState: { errors },reset} = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      contactNumber: user?.contactNumber || user?.phone || "",
      address: user?.address || "",
      bio: user?.bio || "",
    });
  }, [reset, user]);

  // on submit
  const onSubmit = async (data) => {
    try {
      const result = await updateProfile({
        id:user?._id,
        name:data.name,
        email:data.email,
        contactNumber:data.contactNumber || "",
        address:data.address || "",
        bio:data.bio || "",
      }).unwrap();

      notifySuccess(result?.message);
    } catch (error) {
      notifyError(error?.data?.message || "Profile could not be updated");
    }
  };
  return (
    <div className="profile__info">
      <h3 className="profile__info-title">Personal Details</h3>
      <div className="profile__info-content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("name", { required: `Name is required!` })} name='name' type="text" placeholder="Enter your username" />
                  <span>
                    <UserThree/>
                  </span>
                  <ErrorMsg msg={errors.name?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("email", { required: `Email is required!` })} name='email' type="email" placeholder="Enter your email" />
                  <span>
                    <EmailTwo/>
                  </span>
                  <ErrorMsg msg={errors.email?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("contactNumber")} name='contactNumber' type="tel" placeholder="Enter your mobile number" />
                  <span>
                    <PhoneThree/>
                  </span>
                  <ErrorMsg msg={errors.contactNumber?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("address")} name='address' type="text" placeholder="Enter your address" />
                  <span>
                    <LocationTwo/>
                  </span>
                  <ErrorMsg msg={errors.address?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <textarea {...register("bio")} name='bio' placeholder="Enter your bio" />
                  <ErrorMsg msg={errors.bio?.message} />
                </div>
              </div>
            </div>
            <div className="col-xxl-12">
              <div className="profile__btn">
                <button type="submit" className="tp-btn">Update Profile</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;

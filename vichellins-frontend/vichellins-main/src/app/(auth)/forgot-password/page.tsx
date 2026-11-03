"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/hooks/useToast";
import { forgotPassswordHandler } from "@/lib/redux/slices/auth/authThunk";
import { AppDispatch } from "@/lib/redux/store";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";

// interface ForgotPasswordProps {}
const ForgotPassword: FC = () => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	// const [noCaptcha, setNoCaptcha] = useState(true);

	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();

	const handleRequestOtp = async () => {
		if (!email) {
			return toast({
				title: "Invalid Input",
				description: "Please Enter All Fields",
				variant: "destructive",
			});
		}
		setIsLoading(true);

		try {
			const res = await dispatch(forgotPassswordHandler(email));
			if (res.type.includes("rejected"))
				return toast({
					title: "An Error Occurred",
					description: res.payload as string,
					variant: "destructive",
				});
			router.push("/enter-otp");
			return toast({
				title: "OTP Sent",
				description: "An OTP code as been sent to the provided email",
				variant: "success",
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				if (
					error.response?.status === 400 ||
					error.response?.status === 401
				) {
					return toast({
						title: "Error Creating User",
						description: error.response?.data,
						variant: "destructive",
					});
				}
			}

			toast({
				title: "Error Request OTP",
				description: "Something went wrong",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className="py-[4rem] px-8 w-screen flex items-center  bg-white">
			<div className=" mx-auto w-full xl:w-[30%] space-y-12">
				<div className="flex flex-col items-center ">
					<h6 className="font-bold text-[3rem] font-manjari mb-[1rem]">
						Forgot Password
					</h6>
					<p className="font-normal  flex justify-center text-center lg:text-left text-[#344054] text-[1.6rem]">
						Dont worry provide your email and we will send you an
						otp
					</p>
				</div>
				<div className=" py-16 px-8 rounded-xl border border-brandYellow">
					<div className="space-y-8">
						<div className="space-y-4">
							<label
								htmlFor="name"
								className="font-bold text-base"
							>
								Email
							</label>
							<Input
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								type="email"
								placeholder="name@mail.com"
								className="bg-white"
							/>
						</div>

						{/* <div className="grid place-content-center">
              <ReCAPTCHA
                className="w-full text-sm"
                sitekey={process.env.VITE_RECAPTCHA_SITE_KEY as string}
                onChange={() => setNoCaptcha(false)}
              />
            </div> */}

						<Button
							disabled={isLoading}
							className="w-full"
							isLoading={isLoading}
							onClick={() => handleRequestOtp()}
						>
							Request OTP
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;

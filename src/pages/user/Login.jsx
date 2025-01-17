import { ActionButton, AuthFormInput, Texts } from "@/components";
import { useStore } from "@/hooks";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import styles from "../pages.module.css";
import { tryCatchFn, validateFields } from "@/utils";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { userService } from "@/api";
import { toast } from "react-toastify";
import { AuthLayout } from "@/layouts";

export default function Login() {
  const [reveal, setReveal] = useState(false);
  const { setToken } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleHide = () => {
    setReveal((prevReveal) => !prevReveal);
  };

  const onFormSubmit = tryCatchFn(async (credentials) => {
    const { status, data } = await userService.login(credentials);
    if (status === 200) {
      setToken(data.accessToken);
      toast.success(data.msg);
      navigate(from);
    }
  });

  return (
    <AuthLayout caption="Login to your Larry's Collection account">
      <Form
        className={`${styles.form} mx-auto`}
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <AuthFormInput
          type="text"
          id="username"
          name="username"
          label="Username (required)"
          register={register}
          validateFields={validateFields?.username}
          errors={errors.username}
          placeholder=""
          className="mb-3"
        />
        <div className="position-relative">
          <AuthFormInput
            type={reveal ? "text" : "password"}
            id="password"
            name="password"
            label="Password (required)"
            register={register}
            errors={errors.password}
            validateFields={validateFields?.password}
            placeholder="**********"
            className="mb-3"
          />
          <Texts
            className="position-absolute top-50 end-0 translate-middle cursor"
            onClick={handleHide}
            text={reveal ? <FaRegEyeSlash /> : <FaRegEye />}
          />
        </div>
        <Link to="/forgot-password">
          <Texts
            text="Forgot password?"
            size="1rem"
            color="var(--bg-zinc-700)"
            className="text-start"
          />
        </Link>
        <ActionButton
          text="Login"
          pending={isSubmitting}
          className="w-100 mt-2"
          size="lg"
          disabled={isSubmitting}
          type="submit"
          style={{ backgroundColor: "var(--bg-blue-400)" }}
        />
      </Form>
      <br />
      <hr />
      <br />
      <div className="text-center">
        <Texts
          text="Don't have an account?"
          size="1.2rem"
          className="fw-semibold mb-0"
          color="var(--bg-zinc-700)"
        />
        <Texts
          text="Proceed to create a Footsy account"
          size="1.1rem"
          color="var(--bg-zinc-700)"
        />
        <ActionButton
          text="Proceed to Register"
          className={`mt-3 text-white p-2 ${styles.form}`}
          variant="dark"
          as={Link}
          to="/register"
        />
      </div>
    </AuthLayout>
  );
}

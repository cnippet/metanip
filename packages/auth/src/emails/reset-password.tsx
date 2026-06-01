import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  userEmail?: string;
  resetLink?: string;
}

export const ResetPasswordEmail = ({
  userEmail = "user@example.com",
  resetLink,
}: ResetPasswordEmailProps) => {
  const sentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Html>
      <Head />
      <Tailwind>
        <Preview>Reset your Cnippet account password</Preview>
        <Body className="mx-auto my-auto bg-white px-2 py-6 font-['Google_Sans',Roboto,Arial,sans-serif]">
          <Container className="mx-auto w-125 max-w-full bg-white p-8">
            {/* Date */}
            <Section className="mb-8 text-right">
              <Text className="m-0 text-[#5f6368] text-[14px]">{sentDate}</Text>
            </Section>

            {/* Header */}
            <Section className="mb-6 text-left">
              <Heading className="m-0 font-normal text-[#202124] text-[24px]">
                Reset Your Password
              </Heading>
              <Heading className="m-0 font-normal text-[#202124] text-[20px]">
                {userEmail}
              </Heading>
            </Section>

            {/* Accent Bar */}
            <Section className="mb-8">
              <div className="h-2 bg-[#0066ff]" />
            </Section>

            {/* Main Content */}
            <Section className="mb-6 text-left">
              <Text className="m-0 text-[#5f6368] text-[14px] leading-6">
                Hello,
              </Text>
              <Text className="m-0 text-[#5f6368] text-[14px] leading-6">
                You have recently requested to reset the password for your{" "}
                <strong>Cnippet</strong> account. Click the button below to
                create a new password.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="mb-6 text-center">
              <Button
                className="inline-block rounded-lg border-none bg-[#0066ff] px-8 py-3 text-center font-medium text-[16px] text-white no-underline"
                href={resetLink}
              >
                Reset Password
              </Button>
            </Section>

            {/* Security Notice */}
            <Section className="mb-6 text-left">
              <Text className="m-0 text-[#5f6368] text-[14px] leading-6">
                If you didn&apos;t request a password reset, please ignore this
                email. This link will expire in 24 hours for security reasons.
                Don&apos;t share this email with anyone. Our customer service
                will never ask for your password.
              </Text>
            </Section>

            {/* Divider */}
            <hr className="my-6 border-[#e8eaed] border-t" />

            {/* Footer */}
            <Section className="mt-6 text-center">
              <Img
                alt="Cnippet Logo"
                className="mx-auto mb-4"
                height="auto"
                src="https://res.cloudinary.com/dcxm3ccir/image/upload/v1753948225/logo-light.png"
                width="120"
              />
              <Text className="my-1 text-[#5f6368] text-[12px]">
                If you&apos;ve got questions or need help, visit{" "}
                <Link
                  className="text-[#0066ff] no-underline"
                  href="https://cnippet.dev/community"
                >
                  Cnippet Community
                </Link>
              </Text>
              <Text className="my-1 text-[#5f6368] text-[12px]">
                © {new Date().getFullYear()} Cnippet LLC · All rights reserved
              </Text>
              <Text className="my-0 text-[#5f6368] text-[12px]">
                This email was sent to {userEmail}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmail;

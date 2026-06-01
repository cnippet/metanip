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

interface WelcomeEmailProps {
  username?: string;
  userEmail?: string;
  loginUrl?: string;
}

export const WelcomeEmail = ({
  username = "there",
  userEmail = "user@example.com",
  loginUrl = "https://cnippet.dev/login",
}: WelcomeEmailProps) => {
  const sentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Html>
      <Head />
      <Tailwind>
        <Preview>Welcome to Cnippet — your account is ready</Preview>
        <Body className="mx-auto my-auto bg-white px-2 py-6 font-['Google_Sans',Roboto,Arial,sans-serif]">
          <Container className="mx-auto w-125 max-w-full bg-white p-8">
            {/* Date */}
            <Section className="mb-8 text-right">
              <Text className="m-0 text-[#5f6368] text-[14px]">{sentDate}</Text>
            </Section>

            {/* Header */}
            <Section className="mb-6 text-left">
              <Heading className="m-0 font-normal text-[#202124] text-[24px]">
                Welcome to Cnippet!
              </Heading>
              <Heading className="m-0 font-normal text-[#202124] text-[20px]">
                {username}
              </Heading>
            </Section>

            {/* Accent Bar */}
            <Section className="mb-8">
              <div className="h-2 bg-[#0066ff]" />
            </Section>

            {/* Main Content */}
            <Section className="mb-6 text-left">
              <Text className="m-0 text-[#5f6368] text-[14px] leading-6">
                Hello {username},
              </Text>
              <Text className="m-0 text-[#5f6368] text-[14px] leading-6">
                Your <strong>Cnippet</strong> account ({userEmail}) is all set.
                You can now explore courses, track your progress, and start
                learning robotics.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="mb-6 text-center">
              <Button
                className="inline-block rounded-lg border-none bg-[#0066ff] px-8 py-3 text-center font-medium text-[16px] text-white no-underline"
                href={loginUrl}
              >
                Go to your account
              </Button>
            </Section>

            {/* Security Notice */}
            <Section className="mb-6 text-left">
              <Text className="m-0 text-[#5f6368] text-[14px] leading-6">
                If you did not create this account, please ignore this email or{" "}
                <Link
                  className="text-[#0066ff] no-underline"
                  href="https://cnippet.dev/community"
                >
                  contact support
                </Link>
                .
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

export default WelcomeEmail;

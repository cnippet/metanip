import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface SignInEmailProps {
  username?: string;
  userEmail?: string;
  time?: string;
  ip?: string;
  userAgent?: string;
  securityUrl?: string;
  manageNotificationsUrl?: string;
}

export const SignInEmail = ({
  username = "there",
  userEmail = "user@example.com",
  time = "",
  ip = "",
  userAgent = "",
  securityUrl = "https://cnippet.dev/account/settings/authentication",
  manageNotificationsUrl = "https://cnippet.dev/account/settings",
}: SignInEmailProps) => {
  const sentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Html>
      <Head />
      <Tailwind>
        <Preview>New sign-in to your Cnippet account</Preview>
        <Body className="mx-auto my-auto bg-white px-2 py-6 font-['Google_Sans',Roboto,Arial,sans-serif]">
          <Container className="mx-auto w-125 max-w-full bg-white p-8">
            {/* Date */}
            <Section className="mb-8 text-right">
              <Text className="m-0 text-[#5f6368] text-[14px]">{sentDate}</Text>
            </Section>

            {/* Header */}
            <Section className="mb-6 text-left">
              <Heading className="m-0 font-normal text-[#202124] text-[24px]">
                New Sign-In Detected
              </Heading>
              <Heading className="m-0 font-normal text-[#202124] text-[20px]">
                {username} - {userEmail}
              </Heading>
            </Section>

            {/* Accent Bar */}
            <Section className="mb-8">
              <div className="h-2 bg-[#f59e0b]" />
            </Section>

            {/* Main Content */}
            <Section className="mb-6 text-left">
              <Text className="m-0 text-[#5f6368] text-[14px] leading-6">
                Hello {username},
              </Text>
              <Text className="m-0 text-[#5f6368] text-[14px] leading-6">
                A new sign-in to your <strong>Cnippet</strong> account was
                detected. Here are the details:
              </Text>
            </Section>

            {/* Sign-in Details */}
            <Section className="mb-6 rounded-lg bg-[#f8f9fa] p-4">
              <Row>
                <Column width="120">
                  <Text className="m-0 text-[#5f6368] text-[13px]">Time</Text>
                </Column>
                <Column>
                  <Text className="m-0 text-[#202124] text-[13px]">{time}</Text>
                </Column>
              </Row>
              <Row>
                <Column width="120">
                  <Text className="m-0 text-[#5f6368] text-[13px]">
                    IP Address
                  </Text>
                </Column>
                <Column>
                  <Text className="m-0 text-[#202124] text-[13px]">{ip}</Text>
                </Column>
              </Row>
              <Row>
                <Column width="120">
                  <Text className="m-0 text-[#5f6368] text-[13px]">
                    User Agent
                  </Text>
                </Column>
                <Column>
                  <Text className="m-0 whitespace-pre-line text-[#202124] text-[13px]">
                    {userAgent}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Action Notice */}
            <Section className="mb-6 text-left">
              <Text className="m-0 text-[#5f6368] text-[14px] leading-6">
                If this was you, no action is needed. If you don&apos;t
                recognize this activity, please{" "}
                <Link
                  className="text-[#0066ff] no-underline"
                  href={securityUrl}
                >
                  secure your account
                </Link>{" "}
                immediately.
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
                <Link
                  className="text-[#0066ff] no-underline"
                  href={manageNotificationsUrl}
                >
                  Manage your notification settings
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default SignInEmail;

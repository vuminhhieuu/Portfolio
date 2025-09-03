import { DefaultSeoProps } from 'next-seo';

const defaultSEOConfig: DefaultSeoProps = {
  titleTemplate: '%s | Vu Minh Hieu',
  defaultTitle: 'Vu Minh Hieu – Portfolio',
  description: 'Personal portfolio of Vu Minh Hieu: projects, skills, certificates, and experience.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    siteName: 'Vu Minh Hieu Portfolio',
  },
  twitter: {
    handle: '@your_twitter',
    site: '@your_twitter',
    cardType: 'summary_large_image',
  },
};

export default defaultSEOConfig; 
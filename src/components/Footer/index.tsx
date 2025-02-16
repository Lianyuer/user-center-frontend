import { DefaultFooter } from '@ant-design/pro-components';
const Footer: React.FC = () => {
  const defaultMessage = '鲤鱼荣誉出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Fish Pro',
          title: 'Fish Pro',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'gitee',
          title: "gitee",
          href: 'https://gitee.com/practice-yoga',
          blankTarget: true,
        },
        {
          key: 'Fish Design',
          title: 'Fish Design',
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

interface TeamProps {
  imageUrl: string;
  name: string;
  position: string;
  description: string;
  socialNetworks: SociaNetworkslProps[];
}

interface SociaNetworkslProps {
  name: string;
  url: string;
}

const teamList: TeamProps[] = [
  {
    imageUrl: 'https://github.com/wrafie.png',
    name: 'Muhammad Waliur Rahman',
    position: 'Technical Project Manager',
    description:
      'Leading technical strategy and project execution with expertise in agile methodologies and team coordination',
    socialNetworks: [
      {
        name: 'Linkedin',
        url: 'https://www.linkedin.com/in/wrafie/',
      },
    ],
  },
  {
    imageUrl: 'https://github.com/mahiuddinalkamal.png',
    name: 'Mahiuddin Al Kamal',
    position: 'Software Architect',
    description:
      'Designing scalable software solutions and architecting robust systems for optimal performance',
    socialNetworks: [
      {
        name: 'Linkedin',
        url: 'https://www.linkedin.com/in/mahiuddinalkamal',
      },
      {
        name: 'Facebook',
        url: 'https://www.facebook.com/mahiuddinalkamal',
      },
      {
        name: 'Instagram',
        url: 'https://www.instagram.com/mahiuddinalkamal',
      },
    ],
  },
  {
    imageUrl: 'https://github.com/sadatsajid.png',
    name: 'Asif Sadat',
    position: 'Frontend Lead',
    description:
      'Crafting exceptional user experiences with modern frontend technologies and design principles',
    socialNetworks: [
      {
        name: 'Linkedin',
        url: 'https://www.linkedin.com/in/asif-sadat/',
      },
    ],
  },
];

export const Team = () => {
  const socialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Linkedin':
        return <Linkedin size='20' />;

      case 'Facebook':
        return <Facebook size='20' />;

      case 'Instagram':
        return <Instagram size='20' />;
    }
  };

  return (
    <section id='team' className='container py-24 sm:py-32'>
      <h2 className='text-3xl md:text-4xl font-bold text-center'>
        Meet Our Expert Team
      </h2>

      <p className='mt-4 mb-10 text-xl text-muted-foreground text-center'>
        Building innovative solutions with passion and technical excellence
      </p>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-10'>
        {teamList.map(
          ({
            imageUrl,
            name,
            position,
            description,
            socialNetworks,
          }: TeamProps) => (
            <Card
              key={name}
              className='bg-muted/50 relative mt-8 flex flex-col justify-between items-center'
            >
              <CardHeader className='mt-8 flex flex-col justify-center items-center pb-2 w-full gap-2'>
                <img
                  src={imageUrl}
                  alt={`${name} ${position}`}
                  className='absolute -top-12 left-1/2 -translate-x-1/2 rounded-full w-24 h-24 aspect-square object-cover'
                />
                <CardTitle className='text-center'>{name}</CardTitle>
                <CardDescription className='text-primary font-bold text-center'>
                  {position}
                </CardDescription>
              </CardHeader>

              <CardContent className='text-center pb-2 grow'>
                <p className='text-muted-foreground'>{description}</p>
              </CardContent>

              <CardFooter className='flex justify-center gap-1'>
                {socialNetworks.map(({ name, url }: SociaNetworkslProps) => (
                  <div key={name}>
                    <Button variant='ghost' size='sm' asChild>
                      <a rel='noreferrer noopener' href={url} target='_blank'>
                        <span className='sr-only'>{name} icon</span>
                        {socialIcon(name)}
                      </a>
                    </Button>
                  </div>
                ))}
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};

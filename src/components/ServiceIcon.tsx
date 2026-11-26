import React from 'react';
import {
  PenTool,
  Sparkles,
  Package,
  Monitor,
  Megaphone,
  BookOpen,
  Share2,
  Printer,
  Image,
  FileText,
  CreditCard,
  Film,
  Layers,
  Code2,
  Tent,
} from 'lucide-react';

interface ServiceIconProps {
  iconName: string;
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ iconName, className = 'h-5 w-5' }) => {
  switch (iconName) {
    case 'Code2':
      return <Code2 className={className} />;
    case 'PenTool':
      return <PenTool className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Package':
      return <Package className={className} />;
    case 'Monitor':
      return <Monitor className={className} />;
    case 'Megaphone':
      return <Megaphone className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Share2':
      return <Share2 className={className} />;
    case 'Printer':
      return <Printer className={className} />;
    case 'Image':
      return <Image className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'CreditCard':
      return <CreditCard className={className} />;
    case 'Film':
      return <Film className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Tent':
      return <Tent className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div onClick={onClick} className={['card', className].join(' ')}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return <div className={['card-header', className].join(' ')}>{children}</div>;
}

export function CardBody({ children, className = '' }: CardProps) {
  return <div className={['card-body', className].join(' ')}>{children}</div>;
}

export function CardFooter({ children, className = '' }: CardProps) {
  return <div className={['card-footer', className].join(' ')}>{children}</div>;
}

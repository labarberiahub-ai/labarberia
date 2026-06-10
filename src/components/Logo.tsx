import { Link } from 'react-router-dom'
import logoImg from '@/assets/logo-alt.png'

type Props = { className?: string }

const Logo = ({ className = '' }: Props) => {
  return (
    <Link to="/" className={`inline-flex items-center ${className}`}>
      <img
        src={logoImg}
        alt="La Barbería"
        width={120}
        height={60}
        className="h-12 w-auto object-contain"
      />
    </Link>
  )
}

export default Logo

import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logorosa.svg";

const WHATSAPP_URL = "https://wa.me/553898707072";

interface FooterProps {
  onShowNewProducts?: () => void;
}

const Footer = ({ onShowNewProducts }: FooterProps) => {
  return (
    <footer className="bg-gray-100 text-black py-16 relative overflow-hidden">
      {/* Overlay rosa suave */}
      <div className="absolute inset-0 bg-pink-100 opacity-30 pointer-events-none" />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <img
              src={logo}
              alt="Menina Chick Boutique"
              className="h-16 w-auto"
            />
            <p className="font-body text-sm text-black/70">
              Moda feminina com estilo e elegância para todas as ocasiões.
            </p>
            <div className="flex gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-xl mb-4">Navegue</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="font-body text-sm text-black/70 hover:text-primary transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="font-body text-sm text-black/70 hover:text-primary transition-colors text-left w-full"
                  onClick={
                    typeof onShowNewProducts === "function"
                      ? onShowNewProducts
                      : undefined
                  }
                >
                  Novidades
                </button>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-display text-xl mb-4">Informações</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/sobre-nos"
                  className="font-body text-sm text-black/70 hover:text-primary transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  to="/politica-de-privacidade"
                  className="font-body text-sm text-black/70 hover:text-primary transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <a
                  href={`${WHATSAPP_URL}?text=${encodeURIComponent("Olá! Gostaria de informações sobre trocas e devoluções.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-black/70 hover:text-primary transition-colors"
                >
                  Trocas e Devoluções
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xl mb-4">Contato</h4>
            <ul className="space-y-2 font-body text-sm text-black/70">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp: (38) 9870-7072
                </a>
              </li>
              <li>Seg - Sex: 9h às 18h</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="font-body text-sm text-black/50">
            © 2025 Menina Chick Boutique. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Separator } from './ui/separator';

export function HelpPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex flex-col items-center">
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <HelpCircle className="h-5 w-5" />
                <span className="sr-only">Aide</span>
            </Button>
            <span className="text-xs text-muted-foreground">Aide</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] text-sm" side="bottom" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-primary">À propos d'EcoDesign Comparator</h4>
            <p className="text-muted-foreground">
              EcoDesign Comparator a pour ambition de faire un pont entre Costing et Empreinte carbone et de montrer qu’il n’y a pas forcément contradiction entre ces deux « contraintes ».
            </p>
          </div>
          <Separator />
          <div className="grid gap-2">
             <p>
                Cet outil permet d’évaluer et de comparer, en phase conception, les bénéfices en termes d’empreinte carbone d’une éco conception vis-à-vis du niveau de coût d’un projet suivant trois scénarios de design (« Classique », « Mix » et « EcoDesign ») en partant des matériaux utilisés.
            </p>
            <p>
                L’utilisation de l’IA permet de récupérer des informations clés sur internet ( prix des matériaux, cimenterie à proximité du chantier,..)
            </p>
            <p>
                L’outil guide progressivement l’utilisateur vers le scénario optimal qui permettra de garantir le meilleur coût, tout en maximisant la limitation de l’empreinte carbone du projet analysé.
            </p>
            <p>
                La modification des valeurs des variables permet de modéliser « en grande masse » les résultats des analyses et peut ainsi conduire à une prise de décision sur le design retenu.
            </p>
             <p>
                Cette maquette est plutôt adaptée à des chantiers de travaux, mais elle est sans doute généralisable à d’autres domaines d’activités.
            </p>
             <p>
                Les analyses sont téléchargables au format PDF et permettent à un maitre d’œuvre de démontrer, auprès des parties prenantes, sa volonté de limiter l’empreinte carbone de son projet.
            </p>
            <p className="font-semibold text-foreground">
                Bref une nouvelle idée à finaliser, porteuse de valeur ajoutée, qui pourrait sans doute faire gagner du temps aux acheteurs et aux ingénieurs…
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

import { useEffect, useMemo, useState } from "react";
import Vault from "../models/Vault/Vault";
import { VaultService } from "../services/VaultService";
import CopyService from "../services/impl/CopyService";
import CommsService from "../services/impl/CommsService";

type useVaultType = {
    vaults: Vault[];
    copy: (input: string[]) => Promise<void>;
}

export default function useVault(): useVaultType {

    const [vaults, setVaults] = useState<Vault[]>([]);
    const vaultService = useMemo(() => new VaultService(), []);
    const copyService = useMemo(() => new CopyService(new CommsService()), []);

    const copy = copyService.copy;

    useEffect(() => {
        let cancelled = false;
        if (!cancelled) {
            setVaults(vaultService.get());
        }

        return () => {
            cancelled = true;
        }
    }, [vaultService])

    return { vaults, copy };
}
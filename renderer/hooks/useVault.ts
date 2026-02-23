import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import Vault, { VaultImpl } from "../models/Vault/Vault";
import { VaultService } from "../services/VaultService";
import CopyService from "../services/impl/CopyService";
import CommsService from "../services/impl/CommsService";
import UniqueVaultService from "../services/impl/UniqueVaultService";
import TokenService from "../services/impl/TokenService";

type useVaultType = {
    vaults: Vault[];
    copy: (input: string[]) => Promise<void>;
    add: (texts: string[]) => void;
    deleteVault: (title: string) => void;
    activeVault: Vault;
    setActiveVault(vault: Vault): void;
    executeUniqueVault(id: string): Promise<void>;
    search: string;
    handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
    isEmpty: boolean;
}

export default function useVault(): useVaultType {

    const [count, setCount] = useState<number>(0);

    const [allVaults, setAllVaults] = useState<Vault[]>([]);
    const [activeVault, setActiveVault] = useState<Vault>(null);
    const uniqueVaultService = useMemo(() => new UniqueVaultService(), []);
    const commsService = useMemo(() => new CommsService(), []);
    const tokenService = useMemo(() => new TokenService(commsService), []);
    const vaultService = useMemo(() => new VaultService(uniqueVaultService, tokenService, commsService), []);
    const copyService = useMemo(() => new CopyService(commsService), []);
    const [search, setSearch] = useState<string>("");
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

    const copy = copyService.copy;

    const vaults = useMemo(() => {
        if (!search.trim()) return allVaults;
        const term = search.toLowerCase();
        return allVaults.filter(vault => vault.title.toLowerCase().includes(term));
    }, [allVaults, search]);

    const add = (texts: string[]) => {
        const [title, ...remaining] = texts;

        !activeVault ? vaultService.add({ title, texts: remaining, uniqueVault: false }) : vaultService.modify({ title, texts: remaining, uniqueVault: false });
        setActiveVault(null);
        setCount(prev => prev + 1);
    }

    const deleteVault = (title: string) => {
        vaultService.delete(title);
        setCount(prev => prev + 1);
    }

    const executeUniqueVault = async (id: string) => {
        await uniqueVaultService.execute(id);
    }

    const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }, []);

    const loadVaults = useCallback(() => {
        vaultService.get().then(vaults => {
            setAllVaults(vaults);
            if (!vaults || vaults.length === 0) {
                setIsEmpty(true);
            }
        });
    }, [vaultService]);

    useEffect(() => {
        let cancelled = false;
        if (!cancelled) {
            loadVaults();
        }

        return () => {
            cancelled = true;
        }
    }, [count, loadVaults])

    return { vaults, copy, add, deleteVault, activeVault, setActiveVault, executeUniqueVault, search, handleSearch, isEmpty };
}
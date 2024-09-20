import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<{ password: string; salt: string }> {
	const salt = await bcrypt.genSalt(10);
	return {
		password: await bcrypt.hash(password, salt),
		salt: salt,
	};
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plain, hash);
}
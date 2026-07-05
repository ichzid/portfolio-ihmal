/**
 * Generate bcrypt hash untuk password admin.
 *
 * Cara pakai:
 *   npm run hash-password -- "PasswordSuperKuat!"
 *
 * Output-nya kamu paste ke `ADMIN_PASSWORD_HASH` di .env.local (atau simpan di DB).
 */
import bcrypt from 'bcryptjs'

async function main() {
    const password = process.argv[2]
    if (!password) {
        console.error('Usage: npm run hash-password -- "your-password"')
        process.exit(1)
    }
    if (password.length < 8) {
        console.error('Password minimal 8 karakter.')
        process.exit(1)
    }
    const rounds = 12
    const hash = await bcrypt.hash(password, rounds)
    console.log('\nADMIN_PASSWORD_HASH=' + hash + '\n')
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})

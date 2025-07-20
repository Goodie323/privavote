use anchor_lang::prelude::*;
use anchor_lang::system_program::System;  // Add this for System
use sha2::{Digest, Sha256};  // Make sure this is in your Cargo.toml

declare_id!("J6b6rA5UJxmcuJTm1NVyegP5n6wc9brs9NAwE36W6BKQ");

#[program]
pub mod smartbott {
    use super::*;

    pub fn cast_vote(ctx: Context<CastVote>, choice: String) -> Result<()> {
        let hashed_vote = Sha256::digest(choice.as_bytes());
        let vote_account = &mut ctx.accounts.vote_account;
        vote_account.vote_hash = hashed_vote.into();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(init_if_needed, payer = user, space = 8 + 32, seeds = [b"vote", user.key().as_ref()], bump)]
    pub vote_account: Account<'info, VoteAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct VoteAccount {
    pub vote_hash: [u8; 32],
}

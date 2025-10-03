use anchor_lang::prelude::*;

declare_id!("9TsMZcFzaS5fA3ecNd8PZGubEP31v9tgJdAy98svb2Ff");

#[program]
pub mod smart_contracts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
